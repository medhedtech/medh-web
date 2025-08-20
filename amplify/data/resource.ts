import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== AI and Data Schema Definition ===============================================
This schema defines both a Todo model and AI capabilities for the application.
The AI routes enable conversation and text generation features.
=========================================================================*/
const schema = a.schema({
  
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean().default(false),
      
    })
    .authorization((allow) => [allow.guest()]),

  // AI Conversation Route
  Chat: a
    .conversation()
    .authorization((allow) => [allow.guest()])
    .instructions(`
      You are a helpful AI assistant for the Medh education platform.
      Help users with course-related queries and provide educational guidance.
      Be professional, accurate, and supportive.
    `),

  // AI Generation Route
  ContentGenerator: a
    .generation()
    .authorization((allow) => [allow.guest()])
    .instructions(`
      Generate educational content and course materials.
      Focus on clarity, accuracy, and educational value.
      Follow Medh's professional tone and style.
    `),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});

/*== Frontend Usage Examples =================================================
Example usage of AI features in your frontend code:

1. Chat Conversation:
```typescript
const chatResponse = await client.ai.Chat.send({
  message: "What courses do you recommend for data science beginners?"
});

2. Content Generation:
```typescript
const generatedContent = await client.ai.ContentGenerator.create({
  prompt: "Generate a course outline for Introduction to Machine Learning"
});
```
=========================================================================*/

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
