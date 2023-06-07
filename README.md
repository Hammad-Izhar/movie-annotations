# Movie Annotator

A Next.js webapp used to annotate the emotion of characters synchronously

## Requirements

This is a vanilla Next.js app bootstrapped with create-t3-app. To install the dependencies and run the app locally:

```zsh
npm install
npm run dev
```

**Note:** You may need to provide environment variables by creating a `.env` file from the `.env.example` file in the root directory. Be sure not to commit the `.env` file to version control (i.e. be sure its in `.gitignore`)!

- Google oAuth 2.0 (via **NextAuth**) is used for authentication
- All data is saved to a **MongoDB** collection using **Prisma** as an ORM
- **tRPC** is used to provide a type-safe interface between the MongoDB database and the client-side frontend
- **Ably** is used to provide WebSocket functionality (since Vercel doesn't support hosting a WebSocket server on its serverless functions 😦)

## Notes

### Schema

```
User {
    id: uuid,
    name: string,
    isAdmin: boolean
}

Movie {
    id: uuid,
    name: string,
    url: string,
    numFrames: numbers OR 1M total transactions per month


    characters: string[]
    emotions: string[]
    isPartiallyAnnotated: boolean,
    isFullyAnnotated: boolean,
}

Annotation {
    id: uuid
    movieId: @relation Movie.id
    annotatorId: @relation User.id
    frameNumber: number
    character: string,
    emotion: string,
    valence: number
}

Room {
    id: string,                    // think: grass-melon-beaver
    host: @relation User.id
    movie: @relation Movie.id
}
```

### Actions

**_Create Room_**: fired from the "Create Room" button on the landing page

1. Query the database for the list of all "available" movies
   - Might want to filter out the fully annotated movies?
2. User selects from a dropdown, the move they want to host
3. Generate a room code at random (ex. `grass-melon-beaver`)
4. Push a new `Room` document to the database
5. Redirect the host to `/{roomCode}/host`
6. Connect the host to the Ably channel `{roomCode}`

**_Join Room_**: fired from the "Join Room" button on the landing page

1. User inputs a room code
2. The database is queried to see if the room exists
   - if the room doesn't exist then an error toast will pop up
3. The user will be redirected to `/{roomCode}/annotator`
4. The user will be assigned a character and an emotion
5. Connect the annotator to the Ably channel `{roomCode}`

**_Leave Room_**: fired from the "Leave Room" button on the annotator page

1. The user will be unsubscribed from the `{roomCode}` channel
2. The user will redirect to `/`

**_Close Room_**: fired from the "Close Room" button on the host page

1. The WebSocket channel will be destroyed
2. The Room is removed from the db
3. The user will redirect to `/`

**Note:** Unsure how directly navigating to these pages will affect anything or what will happen if the page is reloaded. Also need to support users joining late (I think users leaving early are fine with this structure)

### Websocket Events

**_Pause_**: The host broadcasts the pause event when the video player is paused

**_Play_**: The host broadcasts the play event when the video player begins playing

**_Frame_**: The host broadcasts the frame event (with frame number) on a new frame
