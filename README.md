
# Assets
* Every asset path property of any object/item/map, etc. Its relative to the asset root described on AssetConfiguration (default value is `/assets/`) 
- Use spine version `3.8.95` (the character object into de json must have that version, if cannot find that version of spine, please change the version number inside json file)

### For Atlas:
* We use [Texture Packer](https://www.codeandweb.com/texturepacker) for item icons and environment objects

# Maps

### Tiles source File and Object source File (image) 
* Must have the same key in `MapConfiguration.ts` than inside of Tiled

### Background
* Each key of the background must be different (WIP: refactor this) but the image source path can be the same.

# Items

### New item creation:
* You need to add a new enrty on the implementations of ItemsRepository, and setup inside the server the necessary image asset

# Environment Items
### This kind of items are all the items that will be placed on the map (could be iteractable items or only for decoration) like trees, plants, mission items to interact with, etc... 

Steps to create and add an item:

* Create a new entry on db of `Environment Object`

* Setup an item on `Tiled`: 
    - You have to add a new `Point` object on the `"objects"` layer.
    - That object need to have a custom property called `id` of type `number` and is the same `id` than the object created on the db. 
    - Then when the system load the map data, will map that `Point` object to a `Environment Object` and place it on the position.

## Environment items assets
At the moment there are two kind of assets supported: `Spine` and `Atlas`.

*   `Spine`: Will be loaded like a separated object and can have all the animations you want
*   (WIP) `Atlas`: This is for object with no animations (mostly environment decorations) and will use the atlas system, which will load a single atlas (preferably one single atlas per map) and use the texture saved on the db object inside that atlas.