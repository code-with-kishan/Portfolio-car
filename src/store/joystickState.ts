/** Module-level mutable joystick state — written by Joystick UI, read by Car in useFrame (zero React overhead) */
export const joystickState = {
  x: 0,      // -1 = full left,  +1 = full right
  y: 0,      // -1 = full back,  +1 = full forward
  brake: false,
}
