let dist = 0
let l_mag = 0
let u_mag = 0
let neg_phase_weight = 0
let pos_phase_weight = 0
let mag = 0
let angle = 0
let s = 0
let r = 0
let v = 0.4
let y = 0
let motoring = false
let button = 0
let led1 = 0
let led0 = 0
let wUL = 0
let wUR = 0
let wLL = 0
let wLR = 0
let x = 0
let mangle = 0
let rx = 0
let ry = 0
let anim = 0
irRemote.connectInfrared(DigitalPin.P9)
let strip = neopixel.create(DigitalPin.P8, 4, NeoPixelMode.RGB)
mecanumRobot.setFreq(200);
basic.forever(function () {
    let start = control.millis();
    let motoring = false
    button = irRemote.returnIrButton()
    if (button == IrButton.Left) {
        x = Math.max(x - 0.05, -1)
        motoring = true
    } else if (button == IrButton.Right) {
        x = Math.min(x + 0.05, 1)
        motoring = true
    } else if (button == IrButton.Down) {
        y = Math.max(y - 0.05, -1)
        motoring = true
    } else if (button == IrButton.Up) {
        y = Math.min(y + 0.05, 1)
        motoring = true
    } else if (button == IrButton.Ok) {
        mecanumRobot.state(MotorState.stop)
        x = 0
        y = 0
        v = 0.4
        r = 0
        motoring = true
    } else if (button == IrButton.Star) {
        v = Math.min(v + 0.1, 1)
        motoring = true;
    } else if (button == IrButton.Hash) {
        v = Math.max(v - 0.1, 0.4)
        motoring = true;
    } else if (button == IrButton.Number_1) {
        r = Math.min(r + 0.1, Math.PI / 4)
        motoring = true;
    } else if (button == IrButton.Number_2) {
        r = Math.max(r - 0.1, -Math.PI / 4)
        motoring = true;
    } else if (button == IrButton.Number_3) {
        mecanumRobot.setLed(LedCount.Right, 4095);
        mecanumRobot.setLed(LedCount.Left, 4095);
    } else if (button == IrButton.Number_4) {
        mecanumRobot.setLed(LedCount.Right, LedState.OFF)
        mecanumRobot.setLed(LedCount.Left, LedState.OFF)
    } else if (button == IrButton.Number_5) {
        s = Math.min(s + 0.01, 1)
        mecanumRobot.setServo(90 + 140 * s)
    } else if (button == IrButton.Number_6) {
        s = Math.max(s - 0.01, -1)
        mecanumRobot.setServo(90 + 140 * s)
    } else if (button == IrButton.Number_7) {
        strip.setBrightness(255)
        strip.setPixelColor(0, vColors.Indigo)
        strip.setPixelColor(1, vColors.Violet)
        strip.setPixelColor(2, vColors.Purple)
        strip.setPixelColor(3, vColors.Blue)
        strip.show()
    } else if (button == IrButton.Number_8) {
        strip.setPixelColor(0, vColors.White)
        strip.setPixelColor(1, vColors.White)
        strip.setPixelColor(2, vColors.White)
        strip.setPixelColor(3, vColors.White)
        strip.show()
    } else if (button == IrButton.Number_9) {
        strip.setPixelColor(0, vColors.Black)
        strip.setPixelColor(1, vColors.Black)
        strip.setPixelColor(2, vColors.Black)
        strip.setPixelColor(3, vColors.Black)
        strip.show()
    }
    angle = Math.atan2(y, x)
    mag = Math.sqrt(x * x + y * y)
    pos_phase_weight = Math.sin(angle + 0.25 * Math.PI)
    neg_phase_weight = Math.sin(angle - 0.25 * Math.PI)
    wUL = 100 * mag * pos_phase_weight * v + 20 * Math.sin(r)
    wUR = 100 * mag * neg_phase_weight * v - 20 * Math.sin(r)
    wLL = 100 * mag * neg_phase_weight * v + 20 * Math.sin(r)
    wLR = 100 * mag * pos_phase_weight * v - 20 * Math.sin(r)

    let fudge = function (x: number) {
        let a = Math.abs(x);
        return a > 1 ? Math.clamp(20, 100, 20 + a) : 0;
    }
    if (motoring) {
        mecanumRobot.Motor(LR.Upper_left, wUL > 0.0 ? MD.Forward : MD.Back, fudge(wUL));
        mecanumRobot.Motor(LR.Upper_right, wUR > 0.0 ? MD.Forward : MD.Back, fudge(wUR));
        mecanumRobot.Motor(LR.Lower_left, wLL > 0.0 ? MD.Forward : MD.Back, fudge(wLL));
        mecanumRobot.Motor(LR.Lower_right, wLR > 0.0 ? MD.Forward : MD.Back, fudge(wLR));
    }
    let end = control.micros();
    if (end - start < 100000) {
        control.waitMicros(100000 - (end - start));
    }
})
// mangle = r * anim % 200 / 100 * Math.PI
// rx = x * Math.cos(mangle) + y * Math.sin(mangle)
// ry = x * Math.sin(mangle) - y * Math.cos(mangle)
// led.plotAll();
// led.unplot(2.5 * (rx + 1), 2.5 * (ry + 1))
// led.setBrightness(64 + 192 * v)
// basic.showNumber(Math.abs(wUL));
// anim += 1
//led.plotAll()
control.inBackground(function () {
    while (true) {
        dist = mecanumRobot.ultra()
        led.plotBarGraph(dist, 32)
    }
})
