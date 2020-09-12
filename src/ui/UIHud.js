import Hero from "../character/Hero.js";

export default class UIHud
{
    constructor(game, canvas, isMobile)
    {
        this.c = canvas;
        this.g = game;
        this.m = isMobile;
        game.i.e.k.u = this.k.bind(this);
        game.i.e.t.u = [this.t.bind(this)];
    }

    /*
        -- FUNCTION NAME: floorScreen
        -- DESCRIPTION: Updates the floor screen (the one showing the missing gems)
    */
    f()
    {
        if (this.l && this.g.e[0])
        {
            let game = this.g;
            this.l = false;

            game.a.p(0);
            this.c.r();

            game.j(function(){
                game.pa = false;
                game.i.d = -1;
            });
        }
    }

    /*
        -- FUNCTION NAME: keyup
        -- DESCRIPTION: Called on the keyup window event
    */
    k(keycode)
    {
        let g = this.g;
        let s = g.p;

        this.f();

        if (this.s)
        {
            if(keycode > 48 && keycode < 52)
            {
                let item = keycode - 48;
                let price = s[item];
                if (price && g.z >= price)
                {
                    g.z -= price;
                    if (item < 2)
                    {
                        g.h.i++;
                        g.h.h++;
                    }
                    else if (item < 3)
                    {
                        g.h.k += 50;
                        g.h.j = g.h.k;
                    }
                    else
                    {
                        g.b = true;
                    }

                    s[item] = 0;
                }
            }
            if (keycode == 81)
            {
                this.s = false;
                g.a.p(0);
                g.pa = false;
            }

            g.c.r();
        }
    }

    /*
        -- FUNCTION NAME: touch
        -- DESCRIPTION: Called when the player interacts with its device's touchscreen
    */
    t(id, type, e)
    {
        this.f();
        let g = this.g;

        if (id >= 18)
        {
            g.x(id < 19 ? 1 : -1);
        }
        else if (id == 12)
        {
            g.a.s();
        }
        else if (id == 13)
        {
            g.r();
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    //
    //  DISPLAY FUNCTIONS
    //
    //////////////////////////////////////////////////////////////////////////////////

    /*
        -- FUNCTION NAME: draw
        -- DESCRIPTION: Visual draws this content on the screen
    */
    d()
    {
        let c = this.c;
        let g = this.g;
        let h = g.h;
        let ic = g.n;

        let maxgas = h.k;
        let gasRatio = Math.max(0, h.j / maxgas);
        let hp = h.h;
        let maxhp = h.i;
        let coins = g.z;
        let missingGems = g.missing;
        let gemStatus = g.g;
        let isBomb = g.b;
        let screenRatio = c.w / c.h;
        let landscape = screenRatio > 1;
        let isMobile = this.m;
        let touchMaps = g.i.e.t;

        let rects = [];
        for (let i = 1; i < 4; i++)
        {
            rects.push(c.t(i));
        }

        let icDraw = ic.d.bind(ic);
        let icDrawKey = ic.k.bind(ic);

        //Drawing the status bar
        //------------------------
        let rectStatus = rects[1];
        c.o(rectStatus[0], rectStatus[1], rectStatus[2], rectStatus[3], -1, 1, 1, 1);

        let padding = rectStatus[3] / 4;
        let lineHeight = rectStatus[3] - padding*2;
        let lineY = rectStatus[1] + rectStatus[3] / 2 - lineHeight / 2;
        let lineX = rectStatus[0] + padding;

        //Hearts
        for (let i = 0; i < maxhp; i++)
        {
            icDraw(5, lineX + lineHeight * 1.15 * i, lineY, lineHeight, lineHeight, i >= hp);
        }

        //Light gauge
        let gaugeHeight = lineHeight /3;
        //Responsive is always complicating things
        let gaugeWidth = (lineHeight * 3 * (1 + (landscape ? 0 : (screenRatio < 9/16 ? 3/8 - screenRatio : 0.15)))) * (maxgas > 100 ? 1.5 : 1.25) - (landscape ? 0 : rectStatus[2] * 0.18);
        let gaugeX = rectStatus[0] + rectStatus[2] - gaugeWidth - padding;
        let gaugeY = lineY + lineHeight / 2 - gaugeHeight / 2;
        let color = (gasRatio < 0.4 ? (gasRatio < 0.15 ? 15 : 13) : 1);

        for (let i = 0; i < 2; i++)
        {
            c.o(gaugeX, gaugeY, gaugeWidth * (i > 0? gasRatio : 1), gaugeHeight, (i < 1? -1 : color), color);
        }

        icDraw(6, gaugeX - gaugeHeight * 3, gaugeY - gaugeHeight / 2, gaugeHeight *2, gaugeHeight * 2);


        //Drawing the inventory bar
        //------------------------
        let rectInv = rects[2];
        c.o(rectInv[0], rectInv[1], rectInv[2], rectInv[3], -1, 1, 1, 1);

        //Gems
        let gemSize = rectInv[(landscape ? 3 : 2)] * 0.08;
        let gemX, gemY;
        for (let i = 0; i < missingGems.length; i++)
        {
            let id = missingGems[i];
            let offset = padding + i * (gemSize + padding);
            gemX = rectInv[0] + (landscape ? rectInv[2] / 2 - gemSize / 2 : offset);
            gemY = rectInv[1] + (landscape ? offset : rectInv[3] / 2 - gemSize / 2);

            icDraw(id, gemX, gemY, gemSize, gemSize, !gemStatus[id]);
        }

        //Coins
        let coinX = (landscape ? gemX : rectInv[0] + rectInv[2] * 0.75)
        let coinY = (landscape ? rectInv[1] + rectInv[3] * 0.835 : gemY);

        icDraw(7, coinX, coinY, gemSize, gemSize);
        c.x("x" + coins, rectInv[0] + rectInv[2] * (landscape ? 0.5 : (coins > 99 ? 0.9 : 0.88)), (landscape ? coinY + rectInv[3] *0.13 : (rectInv[1] + rectInv[3] * 0.6)), 30, 0, 1);

        //Bomb
        if (isBomb)
        {
            icDraw(11, coinX - (landscape ? 0 : rectInv[2] * 0.2), coinY - (landscape ? rectInv[3] * 0.15 : 0), gemSize, gemSize);
        }

        //Map & Sound
        if (landscape)
        {
            let mapX = rectStatus[0] + rectStatus[2] + padding;
            let mapY = rectInv[1] + rectInv[3] + padding * (isMobile ? 1.5 : 1);
            let soundX = mapX + padding + gemSize;

            icDraw(13, mapX, mapY, gemSize, gemSize);
            icDraw(12, soundX, mapY, gemSize, gemSize, !g.a.v);

            if (!isMobile)
            {
                let keySize = gemSize / 2;
                icDrawKey("m", mapX + gemSize / 2 - keySize / 2, mapY + gemSize * 1.25, keySize, keySize);
                icDrawKey("s", soundX + gemSize / 2 - keySize / 2, mapY + gemSize * 1.25, keySize, keySize);
            }
        }

        let rectMaze = rects[0];

        //Draw mobile controls
        if (isMobile)
        {
            //Portrait controls
            if (screenRatio < 1)
            {
                let width = c.w;
                let baseY = (rectInv[1] + rectInv[3]) + rectMaze[1];
                let height = c.h - baseY - rectMaze[1]*2;

                let iconSize = Math.min(height * 0.8, gemSize * 1.5);
                let middleY = baseY + height / 2 + -iconSize*1.35;

                //Movement arrows
                for (let i = 0; i < 4; i++)
                {
                    let x = rectInv[0] + rectInv[2] / 10 + iconSize * (i < 2 || i%2>0 ? 0 : 2) + iconSize * (i%2) + iconSize/5 * (i%2 ? 0: (i < 2 ? -1 : 1));
                    let y = middleY + iconSize * (i%2 ? (i < 2 ? 0 : 2) : 1) + iconSize/5 * (i%2 ? (i < 2 ? -1 : 1) : 0);
                    icDraw(14+i, x, y, iconSize, iconSize);
                    g.i.v[i] = [x, y, iconSize, iconSize];
                }

                //Light buttons and Map/Sound buttons
                iconSize *= 1.25;
                for (let i = 0; i < 2; i++)
                {
                    let x = rectInv[0] + rectInv[2] * 0.58 + iconSize * (i%2)*1.4;
                    let y = middleY;
                    icDraw(18, x, y + iconSize * 1.4, iconSize, iconSize, i);
                    touchMaps[18+i] = [this.t.bind(this,18+i), [x, y + iconSize * 1.4, iconSize, iconSize]];

                    icDraw(13-i, x, y, iconSize, iconSize, !g.a.v);
                    touchMaps[13-i] = [this.t.bind(this, 13-i), [x, y, iconSize, iconSize]];
                }
            }
        }

        let middleX = rectMaze[0] + rectMaze[2] / 2;

        if (this.l)
        {
            c.o(rectMaze[0], rectMaze[1], rectMaze[2], rectMaze[3], 0, -1);

            let spacing = rectMaze[2] * 0.05;
            let middleY = rectMaze[1] + rectMaze[3] / 2 - (rectMaze[2] * 0.03 + spacing *3 + gemSize) / 2;

            c.x("Floor " + g.l, middleX, middleY, 30, 1, 1, -1, 1);
            c.x("Find the missing gem"+ (g.l > 1 ? "s" : "") + " to unlock the stairs", middleX, middleY + spacing, 20, 0, 1, -1, 1);

            let text = "Press any key to continue";
            if (isMobile)
            {
                text = "Touch to countinue";
            }
            c.x(text, middleX, middleY + spacing * 5, 15, 1, 1, -1, 1);

            middleX -= (gemSize * 4 + spacing * 3)/2;
            for (let i = 0; i < 4; i++)
            {
                icDraw(i+1, middleX + (gemSize + spacing) * i, middleY + spacing * 2, gemSize, gemSize, missingGems.includes(i+1));
            }
        }

        if (this.s)
        {
            let prices = g.p;
            c.o(rectMaze[0], rectMaze[1], rectMaze[2], rectMaze[3], 0, -1);

            let titleX = middleX;
            let character = new Hero([], c);
            let itemSize = gemSize*1.25;
            character.t(middleX - itemSize/2, rectMaze[1] + rectMaze[3] / 4, itemSize, itemSize);
            character.s(1, 3, 1);

            let spacing = rectMaze[2]/8;
            middleX -= (spacing*2+itemSize*3)/2;
            let y = rectMaze[3] / 2;

            let itemCount = 0;
            for (let i = 0; i < 3; i++)
            {
                let price = prices[i+1];
                let x =  middleX + (itemSize + spacing)*i;
                icDraw((i < 2 ? 5+i: 11), x, y, itemSize, itemSize);
                c.x((price ? "x" + price : "Sold out"), x + (price ? itemSize*7/8 : itemSize/2), y + itemSize*1.6, 20, 0, (price ? 1 : 2));
                if (price)
                {
                    icDraw(7, x, y + itemSize*1.25, itemSize/2, itemSize/2);
                    itemCount++;
                    if (isMobile)
                    {
                        touchMaps[i+49] = [this.k.bind(this,i+49), [x, y, itemSize*2, itemSize*2]];
                    }
                    else
                    {
                        icDrawKey(i+1, x + itemSize/4, y + itemSize*2, itemSize/2, itemSize/2);
                    }
                }

                let center = rectMaze[0] + rectMaze[2] / 2;
                let txtY = rectMaze[1] + rectMaze[3] * 0.8;

                if (isMobile)
                {
                    c.q([
                        [center-itemSize*1.5, txtY - itemSize / 8],
                        [center-itemSize, txtY - itemSize / 2],
                        [center-itemSize, txtY + itemSize / 3]
                    ], 3);
                    touchMaps[81] = [this.k.bind(this,81), [center - itemSize, txtY - itemSize, itemSize*3, itemSize*3]];
                }
                else
                {
                    icDrawKey("q", center - itemSize/4, txtY + itemSize / 8, itemSize/2, itemSize/2)
                }

                c.x("Return", center, txtY, 20, 0, 1, 0);
            }

            c.x((itemCount ? "Hi there! I've got brand new items for you." : "Sorry, I'm out of stock."), titleX, rectMaze[1] + rectMaze[2] / 6, 25, 1, 1, 0, -1);
        }

    }
}