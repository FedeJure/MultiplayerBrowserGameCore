import { ClientPlayerView } from "../../view/clientPlayerView";
import { Player } from "./player";

export type ClientPlayer = Player & { view: ClientPlayerView };