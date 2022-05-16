let ry = 0
let rx = 0
let anim = 0
let mangle = 0
let l_mag = 0
let u_mag = 0
let neg_phase_weight = 0
let pos_phase_weight = 0
let mag = 0
let angle = 0
let s = 0
let r = 0
let v = 0
let y = 0
let x = 0
let button = 0
let led1 = 0
let led0 = 0
let wUL = 0
let wUR = 0
let wLL = 0
let wLR = 0
irRemote.connectInfrared(DigitalPin.P9)
basic.forever(function () {
    button = irRemote.returnIrButton()
    if (button == IrButton.Left) {
        x = Math.max(x - 0.05, -1)
    } else if (button == IrButton.Right) {
        x = Math.min(x + 0.05, 1)
    } else if (button == IrButton.Down) {
        y = Math.max(y - 0.05, -1)
    } else if (button == IrButton.Up) {
        y = Math.min(y + 0.05, 1)
    } else if (button == IrButton.Ok) {
        mecanumRobot.state(MotorState.stop)
        x = 0
        y = 0
        v = 0
        r = 0
    } else if (button == IrButton.Star) {
        v = Math.min(v + 0.1, 1)
    } else if (button == IrButton.Hash) {
        v = Math.max(v - 0.1, 0)
    } else if (button == IrButton.Number_1) {
        r = Math.min(r + 0.1, 1)
    } else if (button == IrButton.Number_2) {
        r = Math.max(r - 0.1, -1)
    } else if (button == IrButton.Number_3) {
        led0 = 1 - led0
    } else if (button == IrButton.Number_4) {
        led1 = 1 - led1
    } else if (button == IrButton.Number_5) {
        s = Math.min(s + 0.01, 1)
    } else if (button == IrButton.Number_6) {
        s = Math.max(s - 0.01, -1)
    }
    angle = Math.atan2(y, x)
    mag = Math.sqrt(x * x + y * y)
    pos_phase_weight = Math.sin(angle + 0.25 * Math.PI)
    neg_phase_weight = Math.sin(angle - 0.25 * Math.PI)
    u_mag = mag * Math.cos(r * Math.PI / 2) - y * Math.sin(r * Math.PI / 2)
    l_mag = mag * Math.sin(r * Math.PI / 2) + y * Math.cos(r * Math.PI / 2)
    wUL = 100 * u_mag * pos_phase_weight * v
    wUR = 100 * u_mag * neg_phase_weight * v
    wLL = 100 * l_mag * neg_phase_weight * v
    wLR = 100 * l_mag * pos_phase_weight * v
    mecanumRobot.setFreq(1000);
    mecanumRobot.Motor(LR.Upper_left, wUL > 0.0 ? MD.Forward : MD.Back, Math.abs(wUL));
    mecanumRobot.Motor(LR.Upper_right, wUR > 0.0 ? MD.Forward : MD.Back, Math.abs(wUR));
    mecanumRobot.Motor(LR.Lower_left, wLL > 0.0 ? MD.Forward : MD.Back, Math.abs(wLL));
    mecanumRobot.Motor(LR.Lower_right, wLR > 0.0 ? MD.Forward : MD.Back, Math.abs(wLR));
    mecanumRobot.setLed(LedCount.Left, led0 ? LedState.ON : LedState.OFF);
    mecanumRobot.setLed(LedCount.Right, led1 ? LedState.ON : LedState.OFF);
    mecanumRobot.setServo(90 + 140 * s)
    mangle = r * anim % 200 / 100 * Math.PI
    rx = x * Math.cos(mangle) + y * Math.sin(mangle)
    ry = x * Math.sin(mangle) - y * Math.cos(mangle)
    led.plotAll();
    led.unplot(2.5 * (rx + 1), 2.5 * (ry + 1))
    led.setBrightness(64 + 192 * v)
    anim += 1
})
