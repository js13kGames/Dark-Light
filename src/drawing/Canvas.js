export default class Canvas
{
    constructor(game, isMobile)
    {
        //Color palette
        this.p = [
            '#000000', //   0-black,
            '#ffffff', //   1-white
            '#333333', //   2-gray dark
            '#a6a6a6', //   3-gray light,
            '#204572', //   4-blue dark
            '#3870c1', //   5-blue light
            '#af5735', //   6-orange dark
            '#d3986c', //   7-orange light
            '#327724', //   8-green dark
            '#5fad51', //   9-green light
            '#9835a0', //   10-purple dark
            '#c26dcc', //   11-purple light
            '#b29a34', //   12-yellow dark
            '#d6c26b', //   13-yellow light
            '#7f1919', //   14-red dark
            '#ce2e2e', //   15-red light,
            '#e0e0e0'  //   16-gray very light
        ];

        //Things to draw
        //The stuff has been though in the logic to be added in the right order to be drawn
        //one over the others. This is less user friendly to use but it takes less space
        //in the final build
        this.a = {};

        //If the canvas should be drawn this frame
        this.s = true;

        this.m = isMobile;
        this.g = game;

        game.f("resize", this.z.bind(this));

        this.c();
        this.v();
    }

    /*
        -- FUNCTION NAME: getTransform
        -- DESCRIPTION: Calculates the transform (x, y, w, h) of components to be displayed on screen

        Transform component IDs:
            - 1 : Maze
            - 2 : Status bar
            - 3 : Inventory bar
    */
    t(id)
    {
        let windowWidth = this.w;
        let windowHeight = this.h;

        let ratio = windowWidth / windowHeight;

        if (id < 2)
        {
            let height = windowHeight * 0.75;
            if (ratio < 1)
            {
                height = windowWidth * 0.95;
            }

            return [
                //X
                windowWidth / 2 - height / 2 - (ratio > 1 ? windowWidth * 0.1 : 0),
                //Y
                (ratio < 1 ? windowWidth * 0.025 : windowHeight * 0.05),
                //Width
                height,
                //Height
                height,
                //CellSize
                height / 11
            ];
        }
        else if (id < 4)
        {
            let maze = this.t(1);
            let status;
            if (id > 2)
            {
                status = this.t(2)
            }
            return [
                //X
                (ratio > 1 ? (id > 2 ? maze[0] + maze[2] + windowWidth * 0.01 : maze[0]) : maze[0]),
                //Y
                (ratio > 1 ? (maze[1] + (id < 3 ? maze[3] + windowWidth * 0.01 : 0)) : (maze[1] + maze[3] + (id > 2 ? status[3] : 0) + (id > 2 ? windowHeight : windowWidth) * 0.02)),
                //Width
                (ratio > 1 ? (id > 2 ? windowWidth * 0.1 : maze[2]) : maze[2]),
                //Height
                (ratio > 1 ? (id > 2 ? maze[3] : windowHeight * 0.12) : windowHeight * 0.1),
            ];
        }
    }

    /*
        -- FUNCTION NAME: redraw
        -- DESCRIPTION: Forces the canvas to be redrawn on next frame
    */
    r()
    {
        this.s = true;
    }

    /*
        -- FUNCTION NAME: resize
        -- DESCRIPTION: Resizes and replaces the canvas on screen
    */
    z()
    {
        this.c();
        this.b();
        this.r();
    }

    /*
        -- FUNCTION NAME: calculateSize
        -- DESCRIPTION: Based on the current window, it calcules what the canvas should be like
    */
    c()
    {
        let iw = window.innerWidth;
        let width = iw;
        let height = window.innerHeight;
        let maxRatio = 16/9;
        let minRatio = 9/16;
        let padding = 0;
        let ratio = width / height;

        if (ratio > maxRatio)
        {
            width = Math.min(width, height * maxRatio);
        }
        else if (ratio < 1 && ratio > minRatio)
        {
            width = Math.min(width, height * minRatio);
        }

        padding = (iw - width) / 2;

        this.w = width;
        this.h = height;
        this.i = padding;
    }

    /*
        -- FUNCTION NAME: clear
        -- DESCRIPTION: Based on the current window, it calcules what the canvas should be like
    */
    l()
    {
        let w = this.w;
        let h = this.h;

        this.ctx.clearRect(0, 0, w, h);
        this.o(0, 0, w, h, 0);
    }

    /*
        -- FUNCTION NAME: createCanvas
        -- DESCRIPTION: Creates the HTML canvas used to render the game on screen
    */
    v()
    {
        let w = this.w;
        let h = this.h;
        let p = this.i;

        let canvas = document.createElement("canvas");
        this.n = canvas;
        this.b();

        document.body.appendChild(canvas);
        let ctx = canvas.getContext("2d");

        this.ctx = ctx;

        this.o(0, 0, w, h, 0);
    }

    /*
        -- FUNCTION NAME: applyStyle
        -- DESCRIPTION: Updates the Canvas html node with current dimensions and placement on screen
    */
    b()
    {
        let canvas = this.n;
        canvas.setAttribute("width", this.w);
        canvas.setAttribute("height", this.h);
        canvas.style.left = this.i + "px";
    }

    //////////////////////////////////////////////////////////////////////////////////
    //
    //  DISPLAY FUNCTIONS
    //
    //////////////////////////////////////////////////////////////////////////////////

    /*
        -- FUNCTION NAME: draw
        -- DESCRIPTION: Draws the canvas and its content on the screen
    */
    d()
    {
        if (this.s)
        {
            this.l();

            let w = this.w;
            let h = this.h;
            let isMobile = this.m;
            let icon = this.g.n;
            let gameOverCode = this.g.gg;
            let floor = Math.floor;

            //Title screen
            //--------------------------------------------------
            if (!this.g.e[0])
            {
                let text = this.x.bind(this);

                let y = h/8;

                text("Dark Light", w/2, y, 60, 1, 1);
                y+= h/16;

                text("Your lover has been captured by evil creatures.", w/2, y, 20, 0, 1);
                text("They locked her up inside their lair.", w/2, y+h/30, 20, 0, 1);
                text("You must bring her back!", w/2, y+h/10, 20, 0, 1);
                y+= h/5;
                let buttonSize = h/20;
                let buttonX, buttonY;
                let fct;

                for (let i = 0; i < 4; i++)
                {
                    buttonX = w/2 + buttonSize*(i%2 ? -0.5 : (i < 1 ? -1.5 : 0.5));
                    buttonY = y + (i == 1 ? 0: buttonSize);
                    fct = (isMobile ? icon.d.bind(icon, i+14): icon.k.bind(icon,"A" + (i%2 ? (i < 2 ? "u" : "d") : (i < 1 ? "l" : "r"))));
                    fct(buttonX, buttonY, buttonSize, buttonSize);
                    
                }
                y+= buttonSize*3;
                text("Move", w/2, y, 24, 0, 1);

                y += h/16;
                for (let i = 0; i < 2; i++)
                {
                    buttonX = w/2 - buttonSize*i;
                    fct = (isMobile ? icon.d.bind(icon, 18) : icon.k.bind(icon, (i < 1 ? "x" : "z")));
                    fct(buttonX, y, buttonSize, buttonSize, i);
                }

                y+= buttonSize*2;
                text("Increase / Decrease light", w/2, y, 24, 0, 1);

                text("Never run out of light...", w/2, h * 0.85, 24, 1, 1);
                text((isMobile ? "Touch" : "Click") + " anywhere to start", w/2, h * 0.9, 20, 0, 1);

            }
            //Intro cinematic
            //--------------------------------------------------
            /*else if (this.g.e[1])
            {
                Unfortunately I didn't have enough space to fit the cinematic in
            }*/

            //End screen (gameover & win)
            //--------------------------------------------------
            else if (gameOverCode)
            {
                this.g.a.q();
                let isWin = gameOverCode > 8;
                let text = this.x.bind(this);

                let y = h/8;

                text((isWin ? "Congratulation!" : "Game over"), w/2, y, 55, 1, 1);
                y+= h/(isWin ? 8 : 4);

                let reason;
                let size = h/10;
                if (this.g.gg > 1)
                {
                    let hero = this.g.h;
                    hero.t(w/2-size/2, y, size, size);
                    hero.s(0, 3, (isWin ? 2 : 0), !isWin);

                    reason = "As you try to go further, |you sense your strength leaving you.";
                    if (gameOverCode > 8)
                    {
                        reason = "You found your lover! | |You go back home and enjoy a happy life.|Or can you...?"
                    }
                }
                else
                {
                    icon.d(6, w/2-size/2, y, size, size);
                    reason = "Your light faded away only |to let you roam endlessly in the dark.";
                }

                y += size*1.5;
                reason = reason.split('|');
                for (let i = 0; i < reason.length; i++)
                {
                    text(reason[i], w/2, y + i*h/30, 20, 0, 1);
                }

                if (isWin)
                {
                    let time = floor(this.g.t);
                    let hours = floor(time/3600);
                    let minutes = floor((time - hours * 3600) / 60);
                    let seconds = time % 60;

                    let timeStr = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
                    text("Your time: " + timeStr, w/2, y + h/3.5, 30, 1, 1);
                }
               
                text((isMobile ? "Touch" : "Click") + " anywhere to restart", w/2, h * 0.9, 20, 0, 1); 
                
            }
            //Game rendering
            //--------------------------------------------------
            else
            {
                let drawing = this.a;
                for (let id in drawing)
                {
                    drawing[id].d(this);
                }

                let isMobile = this.m;
                let width = this.w;
                let height = this.h;
                if ((isMobile && width > height) || (!isMobile && width < height))
                {
                    this.o(0, 0, width, height, 0, -1);
                    this.x("You need to be in ", width / 2, height *0.47, 30, 1, 1, -1, 1);
                    this.x((width > height ? "Portrait" : "Landscape") + " mode to play", width / 2, height * 0.52, 30, 1, 1, -1, 1)
                }
            }
            this.s = false;
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    //
    //  DRAWING FUNCTIONS
    //
    //////////////////////////////////////////////////////////////////////////////////

    /*
        -- FUNCTION NAME: style
        -- DESCRIPTION: Updates the current canvas context to apply visual styles
    */
    y(cf = -1, cs = -1, lw = 1, isPath = true)
    {
        let ctx = this.ctx;

        ctx.fillStyle = null;
        ctx.strokeStyle = null;

        lw = (this.h / 1008) * lw;

        if (cf >= 0)
        {
            ctx.fillStyle = this.p[cf];
            if (isPath)
            {
                ctx.fill();
            }
        }
        if (cs >= 0)
        {
            ctx.strokeStyle = this.p[cs];
            ctx.lineWidth = lw * (1080 / this.h);
            if (isPath)
            {
                ctx.stroke();
            }
        }
    }

    /*
        -- FUNCTION NAME: alpha
        -- DESCRIPTION: Changes the alpha in the canvas current context
    */
    f(newValue)
    {
        this.ctx.globalAlpha = newValue;
    }

    /*
        -- FUNCTION NAME: dashLine
        -- DESCRIPTION: Updates the canvas current context to be able to draw dashed lines on screen
    */
    e(segments)
    {
        this.ctx.setLineDash(segments);
    }

    /*
        -- FUNCTION NAME: line
        -- DESCRIPTION: Draws a line on screen
    */
    k (x1, y1, x2, y2, c, lw = 1)
    {
        let ctx = this.ctx;

        ctx.strokeStyle = this.p[c];
        ctx.lineWidth = lw * (this.h / 1008);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    /*
        -- FUNCTION NAME: rect
        -- DESCRIPTION: Draws a rectangle on screen
    */
    o(x, y, w, h, cf = -1, cs = -1, lw = 1, d = 0)
    {
        let ctx = this.ctx;

        this.y(cf, cs, lw, false);
        if (cf >= 0)
        {
            ctx.fillRect(x, y, w, h);
        }
        if (cs >= 0)
        {
            ctx.strokeRect(x, y, w, h);
        }

        //Draws a double rectangle
        if (d)
        {
            this.o(x-4, y-4, w+8, h+8, cf, cs, lw, 0);
        }
    }

    /*
        -- FUNCTION NAME: path
        -- DESCRIPTION: Draws a path on screen
    */
    q(points, cf = -1, cs = -1, lw = 1, o = 0)
    {
        let ctx = this.ctx;

        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        points.splice(0, 1);

        for(let key in points)
        {
            let p = points[key];
            ctx.lineTo(p[0], p[1]);
        }
        if (!o)
        {
            ctx.closePath();
        }

        this.y(cf, cs, lw);
    }

    /*
        -- FUNCTION NAME: circle
        -- DESCRIPTION: Draws a circle on screen
    */
    u(x, y, r, cf = -1, cs = -1, lw = 1)
    {
        let ctx = this.ctx;
        ctx.beginPath();

        ctx.arc(x, y, r, 0, Math.PI * 2);

        this.y(cf, cs, lw);
    }

    /*
        -- FUNCTION NAME: arc
        -- DESCRIPTION: Draws arc line on screen
    */
    j(x, y, r, a1, a2, ac, cf = -1, cs = -1, lw = 1)
    {
        let ctx = this.ctx;

        ctx.beginPath();
        ctx.arc(x, y, r, a1, a2, ac);
        this.y(cf, cs, lw, true);
    }

    /*
        -- FUNCTION NAME: text
        -- DESCRIPTION: Draws a string on screen
    */
    x(t, x, y, fs, fb = 0, cf = -1, cs = -1, lw = 1, a = "center")
    {
        let ctx = this.ctx;

        ctx.font = (fb ? "bold " : "") + (fs * (this.h / 1008)) + "px Arial";
        ctx.textAlign = a;
        this.y(cf, cs, lw, 0);

        ctx.fillText(t, x, y);
    }
}