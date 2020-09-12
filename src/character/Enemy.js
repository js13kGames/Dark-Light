import Character from "./Character.js";

export default class Enemy extends Character
{
    /*
        Enemy IDs:
            - 1 : Runner
            - 2 : Ghosters
            - 3 : Nighter
            - 4 : Waller
    */
    constructor(id, uId, cell, canvas, maze)
    {
        super(cell, canvas, maze, uId);

        this.id = id;
        this.a = false;
        this.n = Math.floor(Math.random() * 4);
    }

    /*
        -- FUNCTION NAME: isLight
        -- DESCRIPTION: Calculates if the current character affects the lighting of a tile
    */
    l(col, row)
    {
        let abs = Math.abs;
        let cell = this.p;
        if (this.id == 3)
        {
            return (cell[0] == col && cell[1] == row) || abs(cell[0] - col) > 2 || abs(cell[1] - row) > 2
        }
        return super.l(col, row);
    }

    //////////////////////////////////////////////////////////////////////////////////
    //
    //  DISPLAY FUNCTIONS
    //
    //////////////////////////////////////////////////////////////////////////////////

    /*
        -- FUNCTION NAME: drawSprite
        -- DESCRIPTION: Draws the character sprite on screen

        Frame: Its a 2 frames animation so 0 and 1

        Direction: 
            0: Left
            1: Top
            2: Right
            3: Bottom
    */
    s(frame, direction)
    {
        let c = this.c;
        let t = this.z;
        let x = t[0];
        let y = t[1];
        let w = t[2];
        let h = t[3];
        let horizontal = direction %2 < 1;
        let aggro = this.a;
        let id = this.id;
        let c1 = aggro ? 14 : 12;
        let c2 = aggro ? 15 : 13;
        let m = this.m;
        let cl = this.p;
        let hc = m.g.h.p;
        let hr = m.g.h.r;
        let abs = Math.abs;

        let rect = c.o.bind(c);
        let circle = c.u.bind(c);
        let line = c.k.bind(c);
        let path = c.q.bind(c);

        let cmd;

        //Eyes
        let eyes = (color, offsetY = 0) => {
            if (direction != 1)
            {
                this.e(path, x + w*(direction > 2 ? 0.35 : (direction < 1 ? 0.3 : 0.62)), y + h*0.35 + offsetY, w*0.08, h*0.2, direction > 1, color);
                if (direction > 2)
                {
                    this.e(path, x + w*0.57, y + h*0.35 + offsetY, w*0.08, h*0.2, 0, color);
                }
            }
        }

        //4-WALLER
        if (id > 3)
        {
            //Body
            let body = () => circle(x+w*0.5, y+h*0.5, (frame < 1 ? w*0.4 : w*0.35), c2, c1);

            cmd = [body, eyes.bind(this, 0, (frame < 1 ? h*0.05 : h*0.025))];

            let width = w*0.6;
            let height = w*0.15;

            for (let i = 0; i <= 2; i+=2)
            {
                let offsetX = horizontal ? i-1 : 0;
                let offsetY = !horizontal ? i-1 : 0;
                let col = cl[0] + offsetX;
                let row = cl[1] + offsetY;
                let colDiff = abs(col - hc[0]);
                let rowDiff = abs(row - hc[1]);

                if (!m.i(col, row) && colDiff < 6 && rowDiff < 6)
                {
                    cmd.push(() => {
                        let xPos = x + (!horizontal ? w*0.45 : 0);
                        let yPos = y + (horizontal ? h*0.45 : 0);
                        let rectWidth = (horizontal ? width : height);
                        let rectHeight = (horizontal ? height : width);
                        if (i < 1)
                        {
                            xPos -= (horizontal ? rectWidth : 0);
                            yPos -= (!horizontal ? rectHeight : 0);
                        }
                        else
                        {
                            xPos += (horizontal ? w : 0);
                            yPos += (!horizontal ? h : 0);
                        }
                        rect(xPos, yPos, rectWidth, rectHeight, c2, c2);

                        if (horizontal)
                        {
                            xPos += (i < 1 ? -rectHeight : rectWidth);
                            yPos -= rectHeight;
                            rectWidth = rectHeight;
                            rectHeight *=3;
                        }
                        else
                        {
                            xPos -= rectWidth;
                            yPos += (i < 1 ? -rectWidth : rectHeight);
                            rectHeight = rectWidth;
                            rectWidth *=3;
                        }

                        rect(xPos, yPos, rectWidth, rectHeight, c1, c1);

                        
                        if (colDiff > hr || rowDiff > hr)
                        {
                            c.f(0.9);
                            rect(x + w*offsetX, y + h*offsetY, w, h, 0, -1);
                            c.f(1);
                        }
                    });
                }
            }
        }
        //3-NIGHTER
        else if (id > 2)
        {
            let body, arm;

            let legs = (offsetX = 0) => {
                for (let i = 0; i < 2; i++)
                {
                    rect(x+w*(i < 1 ? 0.3 : 0.55) + offsetX*(i%2<1?1:-1), y + h*0.6 - (i == frame ? h/16 : 0), w*0.15, h/3, c2, c1);
                }
            };

            if (!horizontal)
            {
                //Body
                let body = () => {
                    circle(x+w*0.5, y+h*0.45, w*0.325, c2, c1);
                    if (direction > 2)
                    {
                        for (let i = 3; i > 0; i--)
                        {
                            circle(x+w*0.5, y+h*0.45 + (i<2 && frame > 0 ? h*0.03:0), w*0.08*i, 0, c1);
                        }
                    }
                };

                //Arm
                let arm = () => rect(x+w*0.075, y+h*0.35, w*0.85, h*0.2, c2, c1);

                cmd = [arm, legs, body];
            }
            else
            {
                let body = () => {
                    for (let i = 0; i < 2; i++)
                    {
                        let xPos = x + w*(i < 1 ? 0.65 : 0.75);
                        let width = w*(0.1-i*0.03);
                        if (direction < 1)
                        {
                            xPos = x + w*(i < 1 ? 0.35 : 0.25) - width;
                        }
                        rect(xPos, y+h*(i < 1 ? 0.225 : (frame < 1 ? 0.3 : 0.325)), width, h*(i < 1 ? 0.45 : 0.3), 0, c1);
                    }
                    rect(x + w*0.35, y+h*0.125, w*0.3, h*0.65, c2, c1);
                };

                let arm = () => rect(x + w*(direction < 1 ? 0.65 : 0.25), y + h*0.3, w*0.1, h*0.3, c2, c1);

                cmd = [legs.bind(this, w*0.05), body, arm];
            }
        }
        //2-GHOSTER
        else if (id > 1)
        {
            //Body
            let offset = frame < 1? -h*0.1 : 0;
            let bottom = () => path([
                [x+w*0.2, y+h*0.395],
                [x+w*0.2, y+h*0.9],
                [x+w*0.35, y+h*0.8 + offset],
                [x+w*0.5, y+h*0.9],
                [x+w*0.65, y+h*0.8 + offset],
                [x+w*0.8, y+h*0.9],
                [x+w*0.8, y+h*0.395]
            ], 0, c1, 1);

            let top = () => c.j(x+w*0.5, y+h*0.4, h*0.3, 0, Math.PI, 1, 0, c1);
            cmd = [() => c.f(0.75), bottom, top, eyes.bind(this, c2), () => c.f(1)];
        }
        //1-RUNNER
        else
        {
            //Body
            let body = () => circle(x+w*0.5, y+h*0.5, w*0.3, c2, c1);

            //Horn
            let offset = w*(!horizontal?0:(direction<1?-0.05:0.05));
            let horn = () => path([
                [x + w/2+offset, y],
                [x + w *0.37+offset, y + h*0.3],
                [x + w*0.63+offset, y + h*0.3]
            ], 0, c1);

            //Legs
            let legFct = (offsetX, isLeft) => {
                let offsetY = h*-(isLeft ? (frame < 1 ? 0.1 : 0.05) : (frame < 1 ? 0.05 : 0.1));
                let legX = x+w*(isLeft ? 0.25 : 0.55) + offsetX*w;
                let legY = y+h/2 + offsetY;
                let pantsHeight = h/12;

                rect(legX, legY, w*0.2, h/2, 0, c1);
                rect(legX, legY + h/2 - pantsHeight, w*0.2, pantsHeight, c2, c1);
            };

            let lLeg = legFct.bind(this, horizontal ? 0.05 : 0, 1);
            let rLeg = legFct.bind(this, horizontal ? -0.05 : 0, 0);

            //Mouth
            let teethFct = (xPos) => path([
                [xPos, y+h*2/3],
                [xPos+w*0.16, y+h*2/3],
                [xPos+w*0.08, y+h*2/3+w*0.1]
            ], 0, -1);
            let mouth = () => {
                if (direction != 1)
                {
                    let xPos = x + w*1/3;
                    let width = w*1/3;
                    if (horizontal)
                    {
                        width = w*0.2;
                        xPos = x+w*(direction < 1 ? 1/4 : 4/7)
                    }
                    rect(xPos, y+h*2/3, width, 2, 0);
                    teethFct(xPos);
                    if (direction > 2)
                    {
                        teethFct(xPos + width-w*0.16);
                    }
                }
            };

            cmd = [(direction==1?rLeg:lLeg), (direction==1?lLeg:rLeg), body, eyes.bind(this, 0), horn, mouth];
        }

        for (let key in cmd)
        {
            cmd[key]();
        }

        if (!this.g)
        {
            c.f(0.9);
            rect(x, y, w, h, 0);
            c.f(1);
        }
    }

    /*
        -- FUNCTION NAME: drawEye
        -- DESCRIPTION: Draws the eyes of the character on screen
    */
    e(path, x, y, w, h, left, color)
    {
        path([
            [x, y + h],
            [x + w, y + h],
            [x + w, y + h*(left ? 0.15 : 0)],
            [x, y + h*(left ? 0 : 0.15)]
        ], color, -1);
    }
}