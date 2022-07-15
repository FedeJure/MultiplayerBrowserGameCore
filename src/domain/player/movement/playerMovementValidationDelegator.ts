import { DefaultGameConfiguration } from "../../../infrastructure/configuration/GameConfigurations";
import { PlayerInputRequestRepository } from "../../../infrastructure/repositories/playerInputRequestRepository";
import { Delegator } from "../../delegator";
import { Disposer } from "../../disposer";
import { ServerConnection } from "../../serverConnection";
import { Vector } from "../../vector";
import { ControllablePlayer } from "../players/controllablePlayer";
const stateEventIntervalInSeconds =
  DefaultGameConfiguration.playerStatesEventInterval / 1000;
export class PlayerMovementValidationDelegator implements Delegator {
  private readonly disposer: Disposer = new Disposer();
  private lastInputValidated: number = 0;
  private remotePosition: Vector = Phaser.Math.Vector2.ZERO;
  private nextPredictedPosition: Vector = Phaser.Math.Vector2.ZERO;

  constructor(
    private readonly player: ControllablePlayer,
    private readonly connection: ServerConnection,
    private readonly inputRepository: PlayerInputRequestRepository
  ) {
    this.player = player;
    this.connection = connection;
    this.inputRepository = inputRepository;
  }
  update(time: number, delta: number): void {
    // const currentPosition = this.player.view.positionVector;

    // this.nextPredictedPosition = {
    //   x:
    //     this.remotePosition.x +
    //     this.player.view.velocity.x * stateEventIntervalInSeconds,
    //   y:
    //     this.remotePosition.y +
    //     this.player.view.velocity.y * stateEventIntervalInSeconds,
    // };
    // const x = Phaser.Math.Interpolation.SmoothStep(
    //   0.5,
    //   currentPosition.x,
    //   this.nextPredictedPosition.x
    // );
    // const y = Phaser.Math.Interpolation.SmoothStep(
    //   0.5,
    //   currentPosition.y,
    //   this.nextPredictedPosition.y
    // );
    this.player.view.setPosition(
      this.remotePosition.x,
      this.remotePosition.y,
    );
  }

  init() {

    // setInterval(() => {
    //   const distanceFromRemote = Phaser.Math.Distance.BetweenPoints(
    //     this.remotePosition,
    //     this.player.state.position
    //   );
    //   console.log(distanceFromRemote)
    //   if (distanceFromRemote > 10)
    //   this.player.view.setPositionInTime(
    //     this.remotePosition.x,
    //     this.remotePosition.y,
    //     DefaultGameConfiguration.playerStatesEventInterval * 3
    //   );
    // }, DefaultGameConfiguration.playerStatesEventInterval * 10)
    this.disposer.add(
      this.connection.onPlayersStates.subscribe((event) => {
        const state = event.states[this.player.info.id];
        if (!state) return;
        this.remotePosition = state.position;
        const distanceFromRemote = Phaser.Math.Distance.BetweenPoints(
          this.remotePosition,
          this.player.state.position
        );
        // if (distanceFromRemote > 5) {
        //   this.nextPredictedPosition = {
        //     x: this.remotePosition.x + this.player.view.velocity.x * stateEventIntervalInSeconds,
        //     y: this.remotePosition.y + this.player.view.velocity.y * stateEventIntervalInSeconds,
        //   };
        //   const speed = Phaser.Math.GetSpeed(
        //     distanceFromRemote,
        //     stateEventIntervalInSeconds
        //   );
        //   const directionalVector = new Phaser.Math.Vector2(
        //     this.nextPredictedPosition.x - this.player.view.positionVector.x,
        //     this.nextPredictedPosition.y - this.player.view.positionVector.y
        //   )
        //     .normalize()
        //     .multiply({ x: speed, y: speed });
        //     console.log(directionalVector)
        //   this.player.view.setVelocity(
        //     this.player.view.velocity.x + directionalVector.x,
        //     this.player.view.velocity.y + directionalVector.y
        //   );
        // }
        
        if (
          distanceFromRemote > 10
          // state &&
          // this.inputRepository.getOrCreate(this.player.info.id) ==
          //   state.inputNumber &&
          // state.inputNumber >= this.lastInputValidated
        ) {
          this.player.view.setPositionInTime(
            this.remotePosition.x,
            this.remotePosition.y,
            DefaultGameConfiguration.playerStatesEventInterval * 1
          );
          this.lastInputValidated = state.inputNumber;
        }
        // else {
        //   const nextPredictedPosition = {
        //     x:
        //       this.remotePosition.x +
        //       this.player.view.velocity.x * stateEventIntervalInSeconds,
        //     y:
        //       this.remotePosition.y +
        //       this.player.view.velocity.y * stateEventIntervalInSeconds,
        //   };
        //   this.player.view.setPositionInTime(
        //     nextPredictedPosition.x,
        //     nextPredictedPosition.y,
        //     DefaultGameConfiguration.playerStatesEventInterval
        //   );
        // }
      })
    );
  }

  stop() {}
}

// const seconds = DefaultGameConfiguration.playerStatesEventInterval / 1000;
// export class PlayerMovementValidationDelegator implements Delegator {
//   private readonly disposer: Disposer = new Disposer();
//   private lastInputValidated: number = 0;
//   private remotePosition: Vector = Phaser.Math.Vector2.ZERO;
//   private remoteVelocity: Vector = Phaser.Math.Vector2.ZERO;

//   constructor(
//     private readonly player: Player,
//     private readonly connection: ServerConnection,
//     private readonly inputRepository: PlayerInputRequestRepository
//   ) {
//     this.player = player;
//     this.connection = connection;
//     this.inputRepository = inputRepository;
//   }
//   update(time: number, delta: number): void {
//     const nextPredictedPosition = {
//       x: this.remotePosition.x + this.player.view.velocity.x * seconds,
//       y: this.remotePosition.y + this.player.view.velocity.y * seconds,
//     };
//     this.player.view.setVelocity(
//       this.player.view.velocity.x +
//         Phaser.Math.GetSpeed(nextPredictedPosition.x - this.player.view.x, 66),
//       this.player.view.velocity.y +
//         Phaser.Math.GetSpeed(nextPredictedPosition.y - this.player.view.y, 66)
//     );
//   }

//   init() {
//     this.disposer.add(
//       this.connection.onPlayersStates.subscribe((event) => {
//         const state = event.states[this.player.info.id];
//         if (!state) return;
//         this.remotePosition = state.position;
//         this.remoteVelocity = state.velocity;
//         if (
//           state &&
//           this.inputRepository.getOrCreate(this.player.info.id) ==
//             state.inputNumber &&
//           state.inputNumber >= this.lastInputValidated
//         ) {
//           const distanceFromRemote = Phaser.Math.Distance.BetweenPoints(
//             this.remotePosition,
//             this.player.state.position
//           );
//           if (distanceFromRemote > 10) {
//             const nextPredictedPosition = {
//               x: this.remotePosition.x + this.player.view.velocity.x * seconds,
//               y: this.remotePosition.y + this.player.view.velocity.y * seconds,
//             };
//             this.player.view.setPositionInTime(
//               nextPredictedPosition.x,
//               nextPredictedPosition.y,
//               distanceFromRemote * 4
//             );
//           }
//           this.lastInputValidated = state.inputNumber;
//         }

//       })
//     );
//   }

//   stop() {}
// }
