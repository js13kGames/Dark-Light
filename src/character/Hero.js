import Character from "./Character.js";

export default class Hero extends Character
{
    constructor(cell, canvas, maze)
    {
        super(cell, canvas, maze);
        this.r = 2;

        //Current light gas
        this.j = 100;
        //Maximum light gas
        this.k = 100;

        //Current HP
        this.h = 2;
        //Maximum HP
        this.i = 2;

        /**
            Defines how much gas must be depleted before running out of light.
            Each number represents the amount to remove when the player moves on the field.
            We want the player to be able to move even when almost out of gas so range 0
            is available and costs nothing (range 0 - only the hero cell is light up)
        */
        this.v = [
            //Range 0 tile (unlimited)
            0,
            //Range 1 tile (200 steps allowed)
            0.5,
            //Range 2 tiles (100 steps allowed)
            1,
            //Range 3 tiles (66 steps allowed)
            1.5,
            //Range 4 tiles (50 steps allowed)
            2,
            //Range 5 tiles (25 steps allowed) 
            4
        ];
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

        Type:
            0: Hero
            1: Shopkeeper
            2: Missing one
    */
    s(frame, direction, type = 0, dead = 0)
    {
        let c = this.c;
        let t = this.z;
        let x = t[0];
        let y = t[1];
        let w = t[2];
        let h = t[3];
        let horizontal = direction %2 < 1;

        let rect = c.o.bind(c);
        let path = c.q.bind(c);

        //Body
        let body = () => rect(x + w*(horizontal ? 0.32 : 0.25), y + h*0.25, w*(horizontal ? 0.36 : 0.5), h*0.5, type%2 + 1, 0);

        //Arms
        let armR = () => rect(x + w*0.19, y + h*(frame == 0 ? 0.5 : 0.48), w*0.11, h* 0.2, 3, 0);
        let armL = () => rect(x + w*0.71, y + h*(frame == 0 ? 0.48 : 0.5), w*0.11, h* 0.2, 3, 0);
        if (horizontal)
        {
            let arm = () => rect(x + w*(frame == 0 ? 0.47 : 0.42), y + h*0.5, w*0.13, h* 0.2, 3, 0);
            armL = (frame == 0 ? ()=>{} : arm);
            armR = (frame == 1 ? ()=>{} : arm);
        }

        //Legs
        let legR = () => rect(x + w*(horizontal ? 0.5 : 0.31), y + h*(frame==1 || type ? 0.75 : 0.7), w*0.15, h*0.15, 2, 0);
        let legL = () => rect(x + w*(horizontal ? 0.37 : 0.56), y + h*(frame==0 || type ? 0.75 : 0.7), w*0.15, h*0.15, 2, 0);

        let cmd = [legR, legL, frame == 0 ? armL : armR, body, frame == 0 ? armR : armL];
        if (type)
        {
            cmd.push(armR);
        }

        for (let key in cmd)
        {
            cmd[key]();
        }

        //Head
        this.y(x, y, w, h, frame, direction, type, dead);
    }

    /*
        -- FUNCTION NAME: drawHead
        -- DESCRIPTION: Draws the head of the character
    */
    y(x, y, w, h, frame, direction, type, dead)
    {
        let c = this.c;
        let horizontal = direction %2 < 1;

        //Head
        if (horizontal)
        {
            c.q([
                [x+w*0.25, y+h*0.1],
                [x+w*0.75, y+h*0.1],
                [x+w*0.75, y+h*(direction == 0 ? 0.45 : 0.52)],
                [x+w*0.25, y+h*(direction == 0 ? 0.52 : 0.45)]
            ], 3, 0);
        }
        else
        {
            let highPoint = h*(type > 1 ? 0.2 : 0.1);
            c.q([
                [x+w*0.2, y+highPoint],
                [x+w*0.8, y+highPoint],
                [x+w*0.8, y+h*0.45],
                [x+w*0.5, y+h*0.6],
                [x+w*0.2, y+h*0.45]
            ],
            3, 0);
        }
        if (type > 1)
        {
            for (let i = 0; i < 5; i++)
            {
                c.u(x + w*(i < 2 ? 0.32 + i*0.36 : (0.5 - 0.2*((i-2)%2 + (i>3 ? -1 : 0)))), y + h/12*(i < 2 ? 0 : (i > 2 ? 2 : 1)), w/(i < 2 ? 5 : 8), 2, 0);
            }
        }

        //Eyes
        let eye = () => {
            if (direction == 3)
            {
                c.o(x + w*0.37, y + h*0.27, w*0.06, h*0.17, 0);
                c.o(x + w*0.57, y + h*0.27, w*0.06, h*0.17, 0);
            }
        };
        if (horizontal)
        {
            eye = () => c.o(x + w * (direction == 0 ? 0.35 : 0.6), y + h*0.27, w*0.06, h*0.17, 0);
        }
        if (dead)
        {
            eye = () => {
                c.o(x + w*0.35, y + h*0.37, w/10, h/30, 0, 0);
                c.o(x + w*0.55, y + h*0.37, w/10, h/30,0, 0);
            };
        }
        eye();

        //Head lamp
        if (type < 1)
        {
            c.o(x + w*(horizontal ? 0.25 : 0.2), y+h*0.1, w*(horizontal ? 0.5 : 0.6), h*0.1, 2, 0);
            if (direction == 3)
            {
                c.u(x + w*0.5, y+h*0.15, w*0.1, 1, 0);
            }
            else if (horizontal)
            {
                c.o(x + w*(direction == 0 ? 0.19 : 0.76), y+h*0.08, w*0.05, h*0.15, 1, 0);
            }
        }
    }
}