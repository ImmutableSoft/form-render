# Getting Started

## Install the project dependencies

```
npm install --legacy-peer-deps
```

Install the library without peer dependencies (React). --legacy-peer-deps
skips installing duplicate peerDependencies (React in this case),
allowing the local folder of this component to work in development
(see Testing).

## Available Scripts

In the project directory, you can run:

### Building the library

```
npm build:lib
```

Or just:

```
npm build
```

This builds the library.

### Testing

Move to the main/test application (FormAlly) directory and install the
component. This component and the main/test application must be in the
same high level directory, or change the path (../) appropriately.

```
npm i file:../form-edit
```


### Publishing

```
npm publish
```

This publishes the library to NPM.
