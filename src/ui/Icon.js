export default class Icon
{
    constructor(canvas)
    {
        this.c = canvas;
    }

    /*
        -- FUNCTION NAME: draw
        -- DESCRIPTION: Visual draws this content on the screen

        Icon IDs:
            - 1  : Crystal blue
            - 2  : Crystal orange
            - 3  : Crystal green
            - 4  : Crystal purple
            - 5  : Heart
            - 6  : Light cell
            - 7  : Coin
            - 8  : Stairs locked 
            - 9  : Stairs unlocked
            - 10 : Shop 
            - 11 : Bomb
            - 12 : Sound
            - 13 : Map
            - 14 : Arrow Left
            - 15 : Arrow Top
            - 16 : Arrow Right
            - 17 : Arrow Bottom
            - 18 : Light button
    */
    d(id, x, y, width, height, empty = 0)
    {
        let c = this.c;
        let rect = c.o.bind(c);
        let circle = c.u.bind(c);
        let line = c.k.bind(c);

        let fctCoinIcon = function(x, y, width, height)
        {
            c.j(x + width / 2, y + height / 2, width / 5, Math.PI / -4, Math.PI / 4, Math.PI, -1, 3, 6 * height / 60)
        };

        //  GEMS
        //------------------------------------------
        if (id < 5)
        {
            let path;
            let color = id * 2 + 2;
            let ratio = 0.15;

            //Triangle
            if (id < 2)
            {
                ratio = 0.2
                path = (x, y, width, height) => [
                    [x + width/2, y],
                    [x + width, y + height],
                    [x, y + height],
                    [x + width/2, y],
                ];
            }
            //Square
            else if (id < 3)
            {
                path = (x, y, width, height) => [
                    [x, y + height / 6],
                    [x + width, y + height / 6],
                    [x + width, y + height * 5/6],
                    [x, y + height * 5/6],
                    [x, y + height / 6]
                ];
            }
            //Diamond
            else if (id < 4)
            {
                ratio = 0.2;
                path = (x, y, width, height) => [
                    [x + width / 2, y],
                    [x + width, y + height / 2],
                    [x + width / 2, y + height],
                    [x, y + height / 2],
                    [x + width / 2, y]
                ];
            }
            //Hexagon
            else
            {
                ratio = 0.12;
                path = (x, y, width, height) => [
                    [x + width / 12, y + height / 4],
                    [x + width / 2, y],
                    [x + width * 11/12, y + height / 4],
                    [x + width * 11/12, y + height * 3/4],
                    [x + width / 2, y + height],
                    [x + width / 12, y + height * 3/4],
                    [x + width / 12, y + height / 4]
                ];
            }

            if (empty)
            {
                c.e([12, 8]);
            }

            let paths = [
                path(x, y, width, height),
                path(x + width * 0.2, y + height * 0.2, width * 0.6, height * 0.6)
            ];

            c.q(paths[0], (!empty ? color+1 : -1), color + (empty ? 1 : 0), 2, 0);

            if (!empty)
            {
                let pathLength = paths[0].length;
                for (let i = 0; i < pathLength; i++)
                {
                    let p1 = paths[0][i];
                    let p2 = paths[1][(i + 1 < pathLength ? i + 1 : 0)];

                    line(p1[0], p1[1], p2[0], p2[1], color, 2);
                }

                c.q(paths[1], color);
            }
            else
            {
                c.e([]);
            }
        }
        //  HEART
        //------------------------------------------
        else if (id < 6)
        {
            let ctx = c.ctx;

            y += height * 27/32;
            x += height / 2;

            let r = height / 2;
            let radian = Math.PI / 180;
            let sin = Math.sin;
            let cos = Math.cos;
            let angle1 = -90 * radian;
            let angle2 = -67.5 * radian;
            let angle3 = 180 * radian;
            let angle4 = -112.5 * radian;

            let x1 = x + r * cos(angle1);
            let y1 = y + r * sin(angle1);
            let cx1 = x + r * cos(angle2);
            let cy1 = y + r * sin(angle2);
            let cx2 = x + r * cos(angle4);
            let cy2 = y + r * sin(angle4);
            let chord = 2 * r * sin(22.5 * radian / 2);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.arc(cx1, cy1, chord, angle3, angle3 + 225 * radian);
            ctx.lineTo(x, y);
            ctx.moveTo(x1, y1);
            ctx.arc(cx2, cy2, chord, 0, 135 * radian, true);
            ctx.lineTo(x, y);

            //Ghetto fix for a bug on mobile (landscape only)
            /*if (!empty)
            {
                rect(x - width * 0.05, y - height / 2, width * 0.08, height * 0.5, 14);
            }*/

            c.y((!empty ? 14 : -1), 14, 2, true);
        }
        //  LIGHT CELL
        //------------------------------------------
        else if (id < 7)
        {
            for (let i = 0; i < 3; i++)
            {
                circle(x + width / 2, y + height / 2, width * (0.5 - i * 0.15), (i < 1 ? 2 : (i < 2 ? 3 : 1)), (i < 1 ? 3 : -1));
            }
        }
        //  COIN
        //------------------------------------------
        else if (id < 8)
        {
            circle(x + width / 2, y + height / 2, width * 0.5, 2, 3, 2);
            fctCoinIcon(x, y, width, height);
        }
        //  STAIRS LOCKED
        //------------------------------------------
        else if (id < 9)
        {
            rect(x, y, width, height, 2, -1)
            let cmd = {
                "b":[
                    () => rect(x, y, width, height / 8, 3,2),
                    () => rect(x, y + height * 7/8, width, height / 8, 3, 2)
                ],
                "f": []
            };
            for (let i = 0; i < 4; i++)
            {
                cmd.b.push(()=>rect(x + width * 1/3 * i - width * 1/22 * i, y, width / 8, height, 3, 2));
                cmd.f.push(()=>rect(x + width * 7/8 * (i < 2 ? 0 : 1), y + height * 7/8 * (i%2), width / 8, height / 8, i*2+5, 0));
            }

            for (let t in cmd)
            {
                for (let i in cmd[t])
                {
                    cmd[t][i]();
                }
            }
        }
        //  STAIRS UNLOCKED
        //------------------------------------------
        else if (id < 10)
        {
            rect(x, y, width, height, 0, 2, 2);
            for (let i = 0; i < 2; i++)
            {
                rect(x + width * (i < 1 ? 0.075 : 0.125), y + height * (i < 1 ? 0.05 : 0.38), width * (0.95 - 0.1*(i+1)), height  * 0.33, 3 - i%2);
            }
        }
        //  SHOP
        //------------------------------------------
        else if (id < 11)
        {
            rect(x, y, width, height, 3, 0, 2);
            rect(x + width * 0.12, y + height * 0.12, width * 0.76, height * 0.76, 12, 0, 2);
            circle(x + width / 2, y + height / 2, width /4 , 2, 3);
            fctCoinIcon(x + width * 0.2, y + height * 0.2, width * 0.6, height * 0.6);
        }
        //  BOMB
        //------------------------------------------
        else if (id < 12)
        {
            c.j(x + width *3/4, y + height / 3, width / 4, -Math.PI * 2/3, Math.PI, 1, -1, 3, 3);
            circle(x + width / 2, y + height * 0.7, width * 0.3, 2, -1);
            rect(x + width * 3/8, y + height * 0.33, width / 4, height * 0.15, 2, -1);
        }
        //  SOUND
        //------------------------------------------
        else if (id < 13)
        {
            let color = (empty ? 2 : 3);
            x += width / 4;
            y += height / 12;
            for (let i = 0; i < 2; i++)
            {
                circle(x + width / 2 * i, y + height * (1-2/7-0.05), height / 7, color);
                rect(x + width / 2 * i + height * 0.033, y + height * 0.05, width / 10, height * 0.7, color);
            }
            rect(x + height * 0.033, y + height * 0.05, width / 1.8, width / 10, color);
            if (empty)
            {
                line(x, y, x + width * 0.75, y + height * 0.75, color, 5);
            }
        }
        //  MAP
        //------------------------------------------
        else if (id < 14)
        {
            let size = width / 4;
            rect(x, y, width, height, 0, 3);
            for (let i = 0; i < 16; i++)
            {
                rect(x + i%4 * size, y + Math.floor(i/4) * size, size, size, (i%3.5 == 1 ? 3 : -1), 2);
            }
        }
        //  ARROW BUTTONS (up, down, left, right)
        //------------------------------------------
        else if (id < 18)
        {
            let direction = id - 14;
            let path;
            rect(x, y, width, height, 2, 3);
            x += width * 0.2;
            y += height * 0.2;
            width *= 0.6;
            height *= 0.6;
            if (direction %2)
            {
                let h = height * (direction - 1) / 2;
                path = [
                    [x + width / 2, y + h],
                    [x, y - h + height],
                    [x + width, y - h + height]
                ];
            }
            else
            {
                let w = width * (direction / 2);
                path = [
                    [x + w, y + height / 2],
                    [x - w + width, y],
                    [x - w + width, y + height]
                ];
            }

            c.q(path, 3, -1);
        }
        //  LIGHT BUTTON (+/-)
        //------------------------------------------
        else if (id < 19)
        {
            rect(x, y, width, height, 2, 3);
            rect(x + width * 0.2, y + height * 0.45, width * 0.6, height * 0.1, 3);

            if (!empty)
            {
                rect(x + width * 0.45, y + height * 0.2, width * 0.1, height * 0.6, 3);
            }
        }
    }

    /**
        -- FUNCTION NAME: drawKey
        -- DESCRIPTION: Draws a keyboard key on the screen. 
                        Au, Ad, Al, Ar means "arrow" + direction (up, down, left, right)
    */
    k(key, x, y, width, height)
    {
        let c = this.c;
        let rect = c.o.bind(c);
        let line = c.k.bind(c);

        rect(x, y, width, height, 2, 1);
        rect(x + width * 0.1, y + height * 0.1, width * 0.8, height * 0.65, 1, 2);

        if (key.length == 2)
        {
            let path;
            let lineWidth = height / 15;
            if (key == "Au" || key == "Ad")
            {
                path = [
                    [x + width * 0.33, y + height * 0.43],
                    [x + width /2, y + height * (key == "Au" ? 0.25 : 0.6)],
                    [x + width * 0.67, y + height * 0.43]
                ];
                line(x + width / 2, y + height * 0.25, x + width / 2, y + height * 0.6, 0, lineWidth);
            }
            else
            {
                path = [
                    [x + width /2, y + height * 0.26],
                    [x + width * (key == "Al" ? 0.33 : 0.67), y + height * 0.42],
                    [x + width /2, y + height * 0.58]
                ];
                line(x + width * 0.33, y + height * 0.42, x + width * 0.67, y + height * 0.42, 0, lineWidth);
            }

            c.q(path, -1, 0, lineWidth, 1);
        }
        else
        {
            c.x(key, x + width / 2, y + height * 0.6, height /2.5, 1, 0, 1);
        }
    }
}