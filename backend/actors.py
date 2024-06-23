import asyncio
import uuid
from urllib import request

import ray
import argparse
import openai
import time
import asyncpg

from ai21 import AI21Client
from ai21.models.chat import ChatMessage

from dotenv import load_dotenv

load_dotenv()

from quart import Quart, websocket

@ray.remote
class LLMProxy:

    def __init__(self):
        self.model = JambaLLMActor.remote()
        #self.model = OpenAIActor.remote()

    def generate(self, conversation: list[ChatMessage], temperature: float=0.7) -> str:
        return ray.get(self.model.generate.remote(
            conversation=conversation,
            temperature=temperature
        ))


@ray.remote
class JambaLLMActor:

    def __init__(self):
        import os
        from dotenv import load_dotenv

        load_dotenv()
        print("!!!" + os.getenv("AI21_API_KEY") + "!!!")
        self.client = AI21Client(api_key=os.getenv("AI21_API_KEY"))

        system = "You're a support engineer in a SaaS company"

    def generate(self, conversation: list[ChatMessage], temperature: float) -> str:
        try:
            res = self.client.chat.completions.create(
                messages=conversation,
                model="jamba-instruct-preview",
            )

            return res.choices[0].message.content
        except Exception as e:
            print(e)
            print("Sent: ")
            print(conversation)


@ray.remote
class OpenAIActor:

    def generate(self, conversation: list[ChatMessage], temperature: float) -> str:
        res = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=conversation,
            temperature=temperature
        )

        return res.choices[0].message.content


@ray.remote
class AgentActor:
    language_model: LLMProxy

    system_prompt: str
    thoughts: list
    memory: dict
    abilities: list
    conversations: dict
    contacts: dict # User/AgentID -> ConversationRef/AgentRef

    def __init__(self):
        self.thoughts = []
        self.memory = {}
        self.abilities = []
        self.conversations = {}
        self.last_action = ""
        self.perception = ""

    def add_language_model(self, language_model):
        self.language_model = language_model

    async def ping(self):
        await asyncio.sleep(1)
        return "pong"

    def receive(self, user, message):
        self.perception = "You received message from user: " + user
        self.conversations[user] = self.conversations.get(user, []) + [message]

        self.think()

    def think(self):
        self.thoughts.append(ChatMessage(role="system", content=self.perception))
        self.thoughts.append(ChatMessage(role="user", content="What are your thoughts? Be as consice as possible to save memory"))

        print("Sending: " + str(self.thoughts))

        llm_res = self.language_model.generate.remote(self.thoughts)
        res = ray.get(llm_res)


        self.thoughts.append(ChatMessage(role="assistant", content="thoughts: " + str(res)))

        self.act()

    def act(self):
        self.thoughts.append(ChatMessage(role="user", content="What actions should you take?"))
        llm_res = self.language_model.generate.remote(self.thoughts)
        res = ray.get(llm_res)
        print("Got: " + res)

        if "TOOL:" in res:
            command = res.split(":")[1]

            try:
                eval("self." + command)
            except Exception as e:
                self.thoughts.append(
                    ChatMessage(
                        role="system",
                        content=f"you tried to use TOOL: '{res}' but got error {str(e)}."
                    )
                )
                time.sleep(1)
                self.think()
        else:
            time.sleep(1)
            self.think()

    def send(self, user, message):
        self.conversations[user].append(message)


@ray.remote
class ConversationActor:
    id: str #userid_agentid
    agent_ref: AgentActor

    def __init__(self, user, agent_ref):
        self.agent_ref = agent_ref
        self.id = user + "_" + self.agent_ref.id.remote()


