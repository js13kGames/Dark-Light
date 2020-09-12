
export default class Input
{
    constructor(game, isMobile)
    {
        this.g = game;

        //Which input is held down by the player (movement only)
        this.d = -1;
        
        //How much time is left for the repeated input to trigger when the player holds down movement
        this.l = 0;

        //Mapping event functions. "k" is for key stroke, "t" is for touch, "m" is for mouse up
        this.e = {"k":{}, "t":{}, "m":{}};

        //Event mapping on movement input (for touch devices)
        this.v = {};

        //Touch ids and their last known location on screen
        this.t = {};

        game.f("keydown", this.j.bind(this));
        game.f("keyup", this.k.bind(this));
        game.f("touchstart", this.c.bind(this, 0));
        game.f("touchmove", this.c.bind(this, 1));
        game.f("touchend", this.c.bind(this, 2));
        game.f("mouseup", this.m.bind(this));
    }

    /**
        If the game is paused or not
    */
    get P() { let game = this.g; return game.gg || game.pa; }

    /*
        -- FUNCTION NAME: update
        -- DESCRIPTION: Called every frame by the game loop
    */
    u(deltaTime)
    {
        if (this.d >= 0 && !this.P)
        {
            this.l -= deltaTime;
            if (this.l < 0)
            {
                this.l = 150;
                this.g.o(this.d);
            }
        }
    }

    /*
        -- FUNCTION NAME: keydown
        -- DESCRIPTION: Called when the player holds a key down on its keyboard
    */
    j(e)
    {
        if (!this.P)
        {
            let c = e.keyCode;
            if (this.d != c-37 && c < 41 && c > 36)
            {
                if (this.d == -1)
                {
                    this.l = 250;
                }
                this.d = c-37;
                this.g.o(this.d);
            }
        }
    }

    /*
        -- FUNCTION NAME: keyup
        -- DESCRIPTION: Called when a key has been released on the player's keyboard
    */
    k(e)
    {
        let c = e.keyCode;
        let g = this.g;
        let trigger = false;

        if (!this.P)
        {
            if (this.d >= 0 && this.d == c-37)
            {
                this.d = -1;
            }
            if (c == 90 || c == 88)
            {
                g.x((c > 88 ? 1 : -1));
            }
            if (c == 83)
            {
                g.a.s();
            }
        }
        if (c == 77)
        {
            g.r();
        }

        let m = this.e.k;
        for(let id in m)
        {
            m[id](c);
        }
    }

    /*
        -- FUNCTION NAME: touch
        -- DESCRIPTION: Called when the player interact with its device's touchscreen
    */
    c(type, e)
    {
        let move = this.v;
        let direction = -1;
        let touchIds = this.t;
        let touches = e.touches;
        let m = this.e.t;

        let fctCheck = function(x, y, rect) {return x >= rect[0] && x <= rect[0] + rect[2] && y >= rect[1] && y <= rect[1] + rect[3]};

        for (let d in move)
        {
            let rect = move[d];

            for (let t in touches)
            {
                let touch = touches[t];
                let x = touch.clientX;
                let y = touch.clientY;

                touchIds[touch.identifier] = [x, y];

                if (fctCheck(x, y, rect))
                {
                    direction = d;
                    break;
                }
            }
            if (type == 2)
            {
                for (let i in touchIds)
                {
                    let isIn = 0;
                    for (let t in touches)
                    {
                        if (i == touches[t].identifier)
                        {
                            isIn = 1;
                            break;
                        }
                    }
                    if (!isIn)
                    {
                        let x = touchIds[i][0];
                        let y = touchIds[i][1];
                        for (let d in move)
                        {
                            if (fctCheck(x, y, move[d]))
                            {
                                 direction = touchIds[i];
                                 this.g.j(function(){this.d = -1;}.bind(this));
                            }
                        }
                        for (let id in m)
                        {
                            if (!m[id][1] || fctCheck(x, y, m[id][1]))
                            {
                                m[id][0](e, type);
                            }
                        }
                        delete touchIds[i];
                    }
                }
            }
        }

        this.d = direction;
        if (type == 0 && direction >= 0)
        {
            this.g.o(direction);
            this.l = 250;
        }

        if (direction == -1)
        {
            this.l = 250;
        }

        if (this.g.e[2])
        {
            this.g.k(() => window.location.reload(), 100);
        }
    }

    /*
        -- FUNCTION NAME: mouse
        -- DESCRIPTION: Called on the mouseup event
    */
    m(e)
    {
        let m = this.e.m;
        for(let id in m)
        {
            m[id](e);
        }

        if (this.g.e[2])
        {
            this.g.k(() => window.location.reload(), 100);
        }
    }
}