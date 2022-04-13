
# Characters

- Use spine version `3.8.95` (the character object into de json must have that version, if cannot find that version of spine, please change the version number inside json file)

# Assets
* Every asset path property of any object/item/map, etc. Its relative to the asset root described on AssetConfiguration (default value is `/assets/`) 

# Maps

### Tiles source File and Object source File (image) 
* Must have the same key in `MapConfiguration.ts` than inside of Tiled

### Background
* Each key of the background must be different (WIP: refactor this) but the image source path can be the same.

# Items

### New item creation:
* You need to add a new enrty on the implementations of ItemsRepository, and setup inside the server the necessary image asset