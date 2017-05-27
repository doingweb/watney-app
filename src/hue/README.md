Hue
===

A Watney API for the Philips Hue lighting system.

Currently only for plain white bulbs, because that's all I have :)

Getting Started
---------------

To fully configure the plugin, we'll need to:

 1. Configure the most basic settings, so we can contact the Hue bridge.
 2. Link with the bridge.
 3. Discover and configure lights and light groups.

### Initial Configuration

To begin with, configure the `host` and a user description in `config.yaml`:

```yaml
hue:
  host: 192.168.1.123
  userDescription: Watney
```

The `host` must be the IP address or hostname of the Hue bridge. The `userDescription` can be whatever you like; it's used as the description that gets saved on the bridge when creating a user during the link phase.

### Link with the Hue Bridge

Execute the `register-user` script under the `tools` directory:

```sh
$ node tools/register-user.js
Press the link button on the thing...
```

Press the link button on the bridge and the newly-registered user name should be returned. Add this to the configuration to authorize the API:

```yaml
hue:
  host: 192.168.1.123
  userDescription: Watney
  username: User name goes here. It should be 40 characters (give or take) and alphanumeric with hyphens.
```

### Configure Lights and Light Groups

To query the bridge for all of the lights and light groups, run the `get-lights-and-groups` script:

```sh
$ node tools/get-lights-and-groups.js
# Raw JSON objects representing lights and light groups
```

The raw objects representing the lights and their states will be dumped. The `name` and `id` values for each light and light group can then be used to complete the configuration and enable accessing lights and groups in Watney scripts:

```yaml
hue:
  host: 192.168.1.123
  userDescription: Watney
  username: bridge-username
  lights:
    PORCH: 1
    LIVING_ROOM_1: 2
    LIVING_ROOM_2: 3
    LIVING_ROOM_3: 4
    BEDROOM: 5
    KITCHEN_1: 6
    KITCHEN_2: 7
    HALLWAY: 8
  lightGroups:
    ALL: 0
    PORCH: 1
    LIVING_ROOM: 2
    KITCHEN: 3
    LIVING_ROOM_KITCHEN_DIMMER: 4
    BEDROOM: 5
    BEDROOM_DIMMER: 6
```

Usage
-----

Once the lights and groups have been configured, corresponding objects can be instantiated against them, and the lights can be manipulated programmatically:

```js
const { Light, LightGroup } = require('../src/hue'),
  {
    lights: { PORCH, HALLWAY },
    lightGroups: { LIVING_ROOM }
  } = require('../src/config').get('hue'),
  [ porchLight, hallwayLight ] = [ PORCH, HALLWAY ].map(id => new Light(id)),
  [ livingRoom ] = [ LIVING_ROOM ].map(id => new LightGroup(id));

await porchLight.on(0.5, 10);
await hallwayLight.off(1);
await livingRoom.on();
```

Events
------

It might be important to a script to know when light state is changed by other scripts. For instance, imagine a script that temporarily brings a light up to full, then back down to its previous brightness after some period of time. If another script caused the light to turn off, the first script probably wouldn't want to turn the light back on just to restore its state since its desired state is now off.

The emitter and event symbols can be found in the `events` object:

```js
const {
  events: {
    emitter: hueEvents,
    LIGHT_STATE_CHANGE
  }
} = require('../src/hue');

hueEvents.on(LIGHT_STATE_CHANGE, (lightId, newState) => console.log(`Light ${lightId} changed.`));
```
