import Game from "../game/Game.js";

export default class Maze
{
    constructor(game, canvas, isMobile)
    {
        this.g = game;
        this.c = canvas;
        this.m = isMobile;
    }

    /*
        -- FUNCTION NAME: generate
        -- DESCRIPTION: Generates a new maze dungeon based on a level (1-4)
    */
    r(level)
    {
        /**
            The size of the maze is based on its level. To simplify the code, its always a square maze.
                - Level #1: 10x10 (so a maze of 30x30 tiles)
                - Level #2: 15x15 (so a maze of 45x45 tiles)
                - Level #2: 20x20 (so a maze of 60x60 tiles)
                - Level #2: 25x25 (so a maze of 75x75 tiles)
        */
        let size = (level - 1) * 5 + 10;

        this.l = level;
        let wallId = 0;
        let pathId = 1;

        let maze = [];
        for(let i = 0; i < size; i++)
        {
            maze.push([]);
            for(let j = 0; j < size; j++)
            {   
                maze[i][j] = wallId;
            }
        }

        let cell = {x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size)};
        maze[cell.x][cell.y] = pathId;

        let walls = [];
        if(cell.x+1 < size){ walls.push({x:cell.x+1, y:cell.y}); }
        if(cell.x-1 >= 0){ walls.push({x:cell.x-1, y:cell.y}); }
        if(cell.y+1 < size){ walls.push({x:cell.x, y:cell.y+1}); }
        if(cell.y-1 >= 0){ walls.push({x:cell.x, y:cell.y-1}); }

        while(walls.length > 0)
        {
            let wallIndex = Math.floor(Math.random() * walls.length);
            let wall = walls[wallIndex];

            let uc = [];

            if(wall.x + 1 < size && maze[wall.x + 1][wall.y] === pathId){ uc.push({x:wall.x - 1, y:wall.y}); }
            if(wall.x - 1 >= 0  && maze[wall.x - 1][wall.y] === pathId){ uc.push({x:wall.x + 1, y:wall.y}); }
            if(wall.y + 1 < size && maze[wall.x][wall.y + 1] === pathId){ uc.push({x:wall.x, y:wall.y - 1}); }
            if(wall.y - 1 >= 0  && maze[wall.x][wall.y - 1] === pathId){ uc.push({x:wall.x, y:wall.y + 1}); }

            if(uc.length === 1)
            {
                maze[wall.x][wall.y] = pathId;
                if(uc[0].x >=0 && uc[0].x <size && uc[0].y >=0 && uc[0].y<size)
                {
                    maze[uc[0].x][uc[0].y] = pathId;

                    if(uc[0].x + 1 < size && maze[uc[0].x + 1][uc[0].y] === wallId){ walls.push({x:uc[0].x+1, y:uc[0].y}); }
                    if(uc[0].x - 1 >= 0 && maze[uc[0].x - 1][uc[0].y] === wallId){ walls.push({x:uc[0].x-1, y:uc[0].y}); }
                    if(uc[0].y + 1 < size && maze[uc[0].x][uc[0].y + 1] === wallId){ walls.push({x:uc[0].x, y:uc[0].y+1}); }
                    if(uc[0].y - 1 >= 0 && maze[uc[0].x][uc[0].y - 1] === wallId){ walls.push({x:uc[0].x, y:uc[0].y-1}); }
                }
            }

            walls.splice(wallIndex, 1);
        }

        //We triple the cells to give the player enough room to maneouver
        let cells = [];
        for (let r in maze)
        {
            let row = [];
            for (let c in maze[r])
            {
                for (let j = 0; j < 3; j++)
                {
                    row.push(maze[r][c]);
                }
            }

            for (let i = 0; i < 3; i++)
            {
                cells.push(row.slice());
            }
        }

        this.e = cells;
        this.x = {};
        this.z = size * 3;

        this.p();
        this.s();
    }

    /*
        -- FUNCTION NAME: spawnProps
        -- DESCRIPTION: Spawns all the different props in the dungeon
    */
    p()
    {
        let game = this.g;
        let size = this.z;
        let level = this.l;
        let rand = Math.random;

        //Stairs
        let middle = Math.ceil(size / 2);
        let stairSpawn = this.n(middle, middle, 1);
        this.g.s(1, 9, stairSpawn);
        this.spawnPoint = [stairSpawn[0], stairSpawn[1] + 1];

        //Gems
        let missingGems = game.missing;
        for (let i = 0; i < missingGems.length; i++)
        {
            let id = missingGems[i];
            this.g.s(1, id, this.n(((id-1) > 1 ? size : 0), ((id-1) % 2 ? size : 0), 1));
        }

        //Light cells
        let gasTable = [
            3,
            5,
            7,
            7
        ]
        let itemCount = gasTable[level - 1];
        this.t(itemCount, game.s.bind(game, 1, 6), 1);

        //Coins
        itemCount = level * 5 + 10;
        let pickPos = () => Math.floor(size * rand());
        let pickCell = () =>  this.n(pickPos(), pickPos(), 1);
        let spawns = this.g.w;
        for (let i = 0; i < itemCount; i++)
        {
            let cell = pickCell();
            let isOk = false;
            while (!isOk)
            {
                isOk = true;
                if (Math.abs(cell[0] - stairSpawn[0]) < 3 && Math.abs(cell[1] - stairSpawn[1]) < 3)
                {
                    isOk = false;
                }
                for (let i in spawns[1])
                {
                    let pos = spawns[1][i];
                    if (cell[0] == pos[0] && cell[1] == pos[1])
                    {
                        isOk = false;
                        break;
                    }
                }
                if (!isOk)
                {
                    cell = pickCell();
                }
            }
            game.s(1, 7, cell);
        }

        //Shop
        /**
            The shop is spawned at a distance of X tiles and Y tiles from the stairs in a random direction.
            For the first level, is is always 3 tiles away from the stairs, we want the player to discover the shop
            sooner than later
        */
        let distance = Math.floor(level + 4 + Math.max(0.25, rand()) * size / 3 * (level < 2 ? 0 : 1));
        let x = stairSpawn[0] + distance * (rand() > 0.5 ? -1 : 1);
        let y = stairSpawn[1] + distance * (rand() > 0.5 ? -1 : 1);
        let shopSpawn = this.n(x, y, 1);
        this.shopSpawn = shopSpawn;

        game.s(1, 10, shopSpawn);
    }

    /*
        -- FUNCTION NAME: spawnEnemies
        -- DESCRIPTION: Spawns the enemies in the dungeon
    */
    s()
    {
        /**
            Enemies are spawned in a square grid around the map. They are placed at fixed distance
            from each others based on the level of the maze. We skip the enemies who are supposed to
            spawn in a distance less than 5 tiles of the player. We want to give room to breath when
            spawning on a new floor.

                - Level #1: 3 rows of 3 enemies (less the ones near the middle)
                - Level #2: 4 rows of 4 enemies (less the ones near the middle)
                - Level #3: 5 rows of 5 enemies (less the ones near the middle)
                - Level #6: 6 rows of 6 enemies (less the ones near the middle)

            The types of enemies are chosen at random from the ID of the level plus the others
            of the previous level. That means for exemple on level 3, enemies 1, 2 and 3 can spawn
        */
        let level = this.l;
        let enemyCount = level + 2;
        this.t(enemyCount, function(level, cell)
        {
            this.g.s(2, Math.ceil(Math.random()*level), cell);
        }
        .bind(this, level));
    }

    /*
        -- FUNCTION NAME: distribute
        -- DESCRIPTION: Distributes objects over the dungeon so they are nicely separated
    */
    t(amount, fctSpawn, spawnMiddle = 0)
    {
        let size = this.z;
        let spacing = Math.round(size / (amount + 1)); //We give padding on each sides
        let middle = size / 2;

        for (let r = 0; r < amount; r++)
        {
            for (let c = 0; c < amount; c++)
            {
                let position = this.n(spacing * (c+1), spacing * (r+1), spawnMiddle);
                if (Math.abs(position[0] - middle) > 5 || Math.abs(position[1] - middle) > 5)
                {
                    fctSpawn(position.slice());
                }
            }
        }
    }

    /*
        -- FUNCTION NAME: explore
        -- DESCRIPTION: Flags cells around a spot as "explored"
    */
    o(cell, range)
    {
        for (let r = cell[1]-range; r < cell[1] + range; r++)
        {
            for (let c = cell[0]-range; c < cell[0] + range; c++)
            {
                this.x[c+"_"+r] = 1;
            }
        }
    }

    /*
        -- FUNCTION NAME: isWall
        -- DESCRIPTION: Checks if a cell is a wall
    */
    i(col, row)
    {
        let cells = this.e;
        return !cells[row] || !cells[row][col];
    }

    /*
        -- FUNCTION NAME: getCell
        -- DESCRIPTION: Gets a cell in a direction

        Direction: 
            0: Left
            1: Top
            2: Right
            3: Bottom
    */
    b(direction, cell)
    {
        return [
            cell[0]+(direction == 0 ? -1 : (direction == 2 ? 1 : 0)),
            cell[1]+(direction == 1 ? -1 : (direction == 3 ? 1 : 0))
        ]
    }

    /*
        -- FUNCTION NAME: getNearest
        -- DESCRIPTION: Finds the nearest empty cell from a coordinate in the dungeon
    */
    n(col, row, middle = 0)
    {
        let register = this.g.w;
        let fctValidateMiddle = function(cell)
        {
            let isOk = 1;
            for (let m = 0; m < 4; m++)
            {
                let check = this.b(m, cell);
                isOk = isOk && !this.i(check[0], check[1]);
            }
            return isOk;
        }
        .bind(this);

        if (this.i(col, row) || (middle && !fctValidateMiddle([col, row])))
        {
            let i = 1;
            while(i < 10)
            {
                for (let j = -i; j < i; j++)
                {
                    for (let k = -i; k < i; k++)
                    {
                        if (!this.i(col + j, row + k))
                        {
                            let isOk = 1;
                            let c = col + j;
                            let r = row + k;

                            for(let type in register)
                            {
                                for (let id in register[type])
                                {
                                    let objPos = register[type][id].p;
                                    if (objPos[0] == c && objPos[1] == r)
                                    {
                                        isOk = 0;
                                        break;
                                    }
                                }
                            }

                            if (isOk)
                            {
                                let cell = [c, r];
                                if (middle)
                                {
                                    if (fctValidateMiddle(cell))
                                    {
                                        return cell;
                                    }
                                }
                                else
                                {   
                                    return cell;
                                }
                            }
                        }
                    }
                }
                i++;
            }
        }

        return [col, row];
    }

    /*
        -- FUNCTION NAME: getRandom
        -- DESCRIPTION: Picks a random cell around a coordinate in the dungeon
    */
    a(cell)
    {
        let canWall = this.i(cell[0], cell[1]);

        let tiles = [];
        for (let r = -1; r < 2; r++)
        {
            for (let c = -1; c < 2; c++)
            {
                if ((c == 0 || r == 0) && (canWall || !this.i(cell[0]+c, cell[1]+r)))
                {
                    tiles.push([cell[0]+c, cell[1]+r]);
                }
            }
        }

        return tiles[Math.floor(Math.random()*tiles.length)];
    }

    /*
        -- FUNCTION NAME: findPath
        -- DESCRIPTION: Calculates the path from a start cell to an end cell
    */
    f(startCell, endCell, canWall)
    {
        let queue = [{
            "c": startCell,
            "p": [],
            "s": 0
        }];
        let past = {};

        while(queue.length > 0)
        {
            let current = queue.shift();

            for (let i = 0; i < 4; i++)
            {
                let newPath = this.fc(current, i, endCell, canWall);
                if (newPath.s > 0)
                {
                    return newPath.p[0];
                }
                else if (newPath.s == 0)
                {
                    let id = newPath.c[0] + "_" + newPath.c[1];
                    if (!past[id] || past[id].length > newPath.p.length)
                    {
                        past[id] = newPath.p;
                        queue.push(newPath);
                    }
                    
                }
            }
        }
    }

    /*
        -- FUNCTION NAME: findCell
        -- DESCRIPTION: Used in the pathfinding algorithm
    */
    fc(location, direction, endCell, canWall)
    {
        let newCell = this.b(direction, location.c);
        let path = location.p.slice();

        path.push(newCell);

        let state  = (endCell[0] == newCell[0] && endCell[1] == newCell[1] ? 1 : (!canWall && this.i(newCell[0], newCell[1]) ? -1 : 0));
        if (state == 0)
        {
            let enemies = this.g.w[2];
            for (let id in enemies)
            {
                let cell = enemies[id].p;
                if (cell[0] == newCell[0] && cell[1] == newCell[1])
                {
                    state = -1;
                    break;
                }
            }
        }

        return {
            "c": newCell,
            "p": path,
            "s": state
        };
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
        let game = Game.instance;
        let isMobile = this.m;
        let canvas = this.c;
        let cells = this.e;
        let register = this.g.w;
        let hero = this.g.h;
        let aggro = false;
        let map = this.map;
        let size = this.z;

        let transform = canvas.t(1);
        let x = transform[0];
        let y = transform[1];
        let height = transform[3];
        let cellSize = transform[4];

        let rect = canvas.o.bind(canvas);
        let drawQueue = [];

        //Drawing the grid
        if (!map)
        {
            for (let row = hero.p[1] - 5, i = 0; row <= hero.p[1] + 5; row++, i++)
            {
                for (let col = hero.p[0] - 5, j = 0; col <= hero.p[0] + 5; col++, j++)
                {   
                    let isLight = hero.l(col, row);
                    for (let id in register[2])
                    {
                        isLight &= register[2][id].l(col, row);
                    }

                    let cellX = j * cellSize + x;
                    let cellY = i * cellSize + y;
                    rect(cellX, cellY, cellSize, cellSize, (isLight ? 1 : 0), -1);

                    if (this.i(col, row) && isLight)
                    {
                        this.w(cellX, cellY, col, row, cellSize);
                    }
                    else if (isLight)
                    {
                        this.h(cellX, cellY, col, row, cellSize);
                    }

                    //Drawing the monsters and the props
                    for (let type in register)
                    {
                        for (let id in register[type])
                        {
                            let obj = register[type][id];
                            let cell = obj.p;
                            if (cell[0] == col && cell[1] == row)
                            {
                                obj.t(cellX, cellY, cellSize, cellSize);
                                obj.g = isLight;
                                drawQueue.push(obj.d.bind(obj));

                                aggro = aggro || obj.a;
                            }
                        }
                    }
                    drawQueue.push(()=>rect(cellX, cellY, cellSize, cellSize, -1, (isLight ? 3 : 2)));
                }
            }

            for (let i  in drawQueue)
            {
                drawQueue[i]();
            }

            //Drawing the hero
            hero.t(x + cellSize * 5, y + cellSize * 5, cellSize, cellSize);
            hero.d();
        }
        //Drawing the map
        else
        {
            let explored = this.x;
            let cellSize = height / size;
            let spawnPoint = this.spawnPoint;
            let shopSpawn = this.shopSpawn;
            let icon = this.g.n;
            let isShop = 0;
            let isStairs = 0;

            for (let r = 0; r < size; r++)
            {
                for (let c = 0; c < size; c++)
                {
                    let isExplored = explored[c+"_"+r];
                    let color = 0;
                    let cellX = x + cellSize * c;
                    let cellY = y + cellSize * r;
                    let isShop = isExplored && shopSpawn[0] == c && shopSpawn[1] - 1 == r;
                    let isStairs = spawnPoint[0] == c && spawnPoint[1] - 1 == r;

                    if (isExplored)
                    {
                        color = (this.i(c, r) ? this.y(c, r) : 1);
                    }
                    canvas.o(cellX, cellY, cellSize, cellSize, color, 2, 0.5 / this.l);

                    if (isShop)
                    {
                         canvas.o(cellX, cellY, cellSize, cellSize, 12, 13, 2);
                    }

                    if (isStairs)
                    {
                        icon.d(8, cellX, cellY, cellSize, cellSize);
                    }

                    let heroCell = hero.p;
                    if (heroCell[0] == c && heroCell[1] == r)
                    {
                        canvas.o(cellX, cellY, cellSize, cellSize, 14, 15, 1);
                        hero.t(cellX, cellY, cellSize, cellSize);
                        hero.d(0, 3);
                    }
                }
            }
        }

        //Drawing the borders
        canvas.o(x, y, height, height, -1, (aggro && !map ? 15 : 1), 1, 1);

    }

    /*
        -- FUNCTION NAME: drawGround
        -- DESCRIPTION: Draws the ground of a cell on screen
    */
    h(x, y, col, row, cellSize)
    {
        let color = 16;
        let canvas = this.c;

        let lines = [
            //Lines pattern 1
            0.15, 0.85,
            0.45, 0.85,
            0.15, 0.7,
            0.28, 0.78,
            0.2, 0.7
        ];

        for (let i = 0; i < 10; i+=2)
        {
            let yPos = y + cellSize / 10 * (i + 1);
            canvas.k(x + cellSize*lines[i], yPos,  x + cellSize*lines[i+1], yPos, color, 2);
        }
    }

    /*
        -- FUNCTION NAME: drawWall
        -- DESCRIPTION: Draws a wall on screen

        Middle       -> Gray

        Top left     -> Blue
        Bottom left  -> Orange
        Top right    -> Green
        Bottom right -> Purple
    */
    w(x, y, col, row, cellSize)
    {
        let level = this.l;
        let size = this.z;
        let color = this.y(col, row);
        let canvas = this.c;

        let rect = canvas.o.bind(canvas);

        if (col < 0 || col >= size || row < 0 || row >= size)
        {
            rect(x, y, cellSize, cellSize, 0, -1);
        }

        x += cellSize * 0.05;
        y += cellSize * 0.05;
        cellSize *= 0.9;

        let fctMiddleLines = function(offsetY) {
            canvas.k(x + cellSize * 0.5, y + cellSize * 0.3 + offsetY, x + cellSize * 0.3, y + cellSize * 0.5 + offsetY, color);
            canvas.k(x + cellSize * 0.7, y + cellSize * 0.3 + offsetY, x + cellSize * 0.5, y + cellSize * 0.5 + offsetY, color);
        };

        let fctStraightMiddleLines = function(offsetY) {
            for (let i = 0; i < 2; i++)
            {
                canvas.k(x + cellSize * 0.4, y + cellSize * (i < 1 ? 0.35 : 0.43) + offsetY, x + cellSize * 0.6, y + cellSize * (i < 1 ? 0.35 : 0.43) + offsetY, color, 1);
            }
        };

        let fctDoubleSquare = function(x, y, cellSize, drawLines = 1){
            let shapes = [
                [x, y, cellSize, cellSize],
                [x + cellSize * 0.13, y + cellSize * 0.13, cellSize * 0.74, cellSize * 0.74, color+1]
            ];

            for (let i = 0; i < 2; i++)
            {
                rect(shapes[i][0], shapes[i][1], shapes[i][2], shapes[i][3], color + i, 0, 2);
            }

            if (drawLines)
            {
                for (let i = 0; i < 4; i++)
                {
                    let offsetX = (i > 1 ? 1 : 0);
                    let offsetY = (i %2 > 0 ? 0 : 1);

                    canvas.k(shapes[0][0] + shapes[0][2] * offsetX, shapes[0][1] + shapes[0][3] * offsetY, shapes[1][0] + shapes[1][2] * offsetX, shapes[1][1] + shapes[1][3] * offsetY, 0, 2);
                }
            }
        };

        if (level > 3)
        {
            fctDoubleSquare(x + cellSize * 0.12, y + cellSize * 0.12, cellSize * 0.76, 0);

            let fctGetPath = function(x, y, cellSize) {
                return [
                    [x + cellSize/2, y],
                    [x + cellSize, y + cellSize / 2],
                    [x + cellSize/2, y + cellSize],
                    [x, y + cellSize/2],
                    [x + cellSize/2, y]
                ];
            };

            let paths = [fctGetPath(x, y, cellSize), fctGetPath(x + cellSize * 0.17, y + cellSize * 0.12, cellSize * 0.66)];

            for (let i = 0; i < 2; i++)
            {
                canvas.q(paths[i], color + i, 0, 2);
            }

            for (let i = 0; i < 4; i++)
            {
                let l1 = paths[0][i];
                let l2 = paths[1][i];

                canvas.k(l1[0], l1[1], l2[0], l2[1], 0, 2);
            }

            fctStraightMiddleLines(cellSize * 0.05);
        }
        else if (level > 2)
        {
            fctDoubleSquare(x, y, cellSize);
            for (let i = 0; i < 2; i++)
            {
                canvas.u(x + cellSize / 2, y + cellSize / 2 - cellSize * 0.1 * i, cellSize * (i > 0 ? 0.2 : 0.4), color + i, 0, 2);
            }
            fctStraightMiddleLines(0);
        }
        else if (level > 1)
        {
            let shapes = [];
            for (let i = 0; i < 2; i++)
            {
                let size = cellSize * (i%2 > 0 ? 0.66 : 1);
                let middle = cellSize / 2 - size / 2;
                let xPos = x + middle;
                let yPos = y + middle - size * 0.1 * i;

                shapes.push([
                    [1/4, 0],
                    [3/4, 0],
                    [1, 1/4],
                    [1, 3/4],
                    [3/4,1],
                    [1/4, 1],
                    [0, 3/4],
                    [0, 1/4],
                    [1/4, 0]
                ]);

                for (let j = 0; j < 9; j++)
                {
                    shapes[i][j][0] = xPos + shapes[i][j][0] * size;
                    shapes[i][j][1] = yPos + shapes[i][j][1] * size;
                }

                canvas.q(shapes[i], color + i, 0, 2);
            }

            for (let key in shapes[0])
            {
                let l1 = shapes[0][key];
                let l2 = shapes[1][key];
                canvas.k(l1[0], l1[1], l2[0], l2[1], 0);
            }

            fctMiddleLines(cellSize * 0.015);
        }
        else
        {
            let padding = cellSize * 0.15;

            rect(x, y, cellSize, cellSize, color, 0, 2);
            rect(x + padding, y + padding, cellSize * 0.7, cellSize * 0.55, color+1, 0, 2);

            let positions = [
                0, 0, padding, padding,
                cellSize, 0, cellSize - padding, padding,
                0, cellSize, padding, cellSize * 0.7,
                cellSize, cellSize, cellSize - padding, cellSize * 0.7
            ];

            for (let i = 0; i <= 24; i+=4)
            {
                canvas.k(x + positions[i], y + positions[i + 1], x + positions[i + 2], y + positions[i + 3], 0);
            }

            fctMiddleLines(0);
        }
    }

    /*
        -- FUNCTION NAME: wallColor
        -- DESCRIPTION: Calculates the base color of a wall based on its position in the dungeon
    */
    y(col, row)
    {
        let sections = [0.33, 0.66];
        let size = this.z;
        let index = 1;
        let color = 2;

        for (let i = 0; i < 2; i++)
        {
            for (let j = 0; j < 2; j++)
            {
                let w = size * sections[i];
                let h = size * sections[j];
                if (((i<1 && col <= w) || (i>0 && col >= w)) && ((j<1 && row <= h) || (j>0 && row >= h)))
                {
                    color = 2 + index * 2;
                    break;
                }
                index++;
            }
        }

        return color;
    }
}