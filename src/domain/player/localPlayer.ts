import { ClientPlayerView } from "../../view/clientPlayerView";
import { Player } from "./player";

export type LocalPlayer = Player & { view: ClientPlayerView };