# Discord.js Bot Template

A template for a Discord.js bot with bun.

![](https://img.shields.io/github/package-json/dependency-version/archasion/djs-template/dev/bun-types?label=bun&labelColor=%23F8F1E3&color=%232B2D31&link=https%3A%2F%2Fbun.sh)
![](https://img.shields.io/github/package-json/dependency-version/archasion/djs-template/discord.js?labelColor=%235A65EA&color=%232B2D31&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fdiscord.js)

## Pre-requisites

Skip this section if you will be using the Docker image.

- Bundler (bun) installed globally, see [bun.sh](https://bun.sh) for installation instructions
- An app token passed either via a `.env` file or the `DISCORD_TOKEN` environment variable (see [
  `.env.example`](.env.example))

## Startup

### Local

```bash
make production # or make prod
```

See the [Makefile](Makefile) for more commands.

### Docker

```bash
docker build -t djs-template .
docker run -e DISCORD_TOKEN=your_token_here djs-template
```

## Development

### Commands

In order to create a new command handler, create a new file in the `commands` directory. The file
should
export a class that extends [Command](src/handlers/commands/Command.ts) and is
passed [ApplicationCommandData](https://discord.js.org/docs/packages/discord.js/main/ApplicationCommandData:TypeAlias)
in the `super()` method.

An example command is provided below:

```typescript
import { Command } from "@handlers/commands/CommandManager";
import type { ChatInputCommandInteraction } from "discord.js";

export default class ExampleCommand extends Command {
	constructor() {
		// The super method should contain the command's properties
		// See https://discord.js.org/docs/packages/discord.js/main/ApplicationCommandData:TypeAlias
		super({
			name: "example",
			description: "An example command",
			options: []
		});
	}

	// The execute method is called when the command is invoked
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		interaction.reply("Hello, World!");
	}
}
```

To publish a command to specific guilds rather than globally, simple add an array of guild IDs
after the command data in the `super()` method. For example:

```typescript
super({
	name: "example",
	description: "An example command",
	options: []
}, ["guild_id_1", "guild_id_2"]);
```

#### Autocomplete Interactions

Since autocomplete interactions are command options, they are handled within an `autocomplete()` method that is part of the [Command](src/handlers/commands/Command.ts) class.

An example autocomplete interaction is provided below:

```typescript
import { Command } from "@handlers/commands/CommandManager";
import assert from "node:assert";
import type { AutocompleteInteraction } from "discord.js";

class ExampleCommand extends Command {
  // ...

  // The autocomplete method is called when the command is autocompleted
  override async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const { name } = interaction.options.getFocused(true);
    
    // The name property can be used to determine
    // which autocomplete interaction was triggered
    assert(name === "autocomplete_custom_id");

    const results = [
      { name: "Option 1", value: "option_1" },
      { name: "Option 2", value: "option_2" }
    ];

    interaction.respond(results);
  }
}
```

### Components

Components are similar to commands, but are used for buttons, select menus (dropdowns), etc. To
create a new component handler, create a new file in the `components` directory. The file should
export a class that extends [Component](src/handlers/components/Component.ts) and is passed a
string in the `super()` method
that corresponds to the component's custom ID.

An example component is provided below:

```typescript
import { Component } from "@handlers/components/ComponentManager";
import type { ButtonInteraction } from "discord.js";

export default class ExampleButton extends Component {
	constructor() {
		// The super method should contain the component's custom ID
		super("example");
	}

	// The execute method is called when the component is interacted with
	async execute(interaction: ButtonInteraction): Promise<void> {
		interaction.reply("Hello, World!");
	}
}
```

### Events

Events are used to handle Discord.js events. To create a new event handler, create a new file in the
`events` directory. The file should export a class that
extends [EventListener](src/handlers/events/EventListener.ts) and is passed a string in the `super()` method
that corresponds to the event name.

An example event is provided below:
```typescript
import { EventListener } from "@handlers/events/EventListener";
import type { Client, Events } from "discord.js";

export default class ReadyEvent extends EventListener {
    constructor() {
        // The super method should contain the event name
        super(Events.Ready);
    }

    // The execute method is called when the event is emitted
    async execute(client: Client<true>): Promise<void> {
        console.log(`Logged in as ${client.user.tag}`);
    }
}
```