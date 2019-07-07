import * as PIXI from 'pixi.js';
import Carrier from './carrier';
import EventEmitter from 'events';

class Star extends EventEmitter {
    constructor() {
        super();
        
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;

        // TODO: This doesn't work on page load but works on hot reload. Fucking bullshit.
        this.container.on('pointerdown', this.onClicked.bind(this));

        this.isSelected = false;
    }
    
    _getStarPlayer() {
        return this.players.find(x => x._id === this.data.ownedByPlayerId);
    }

    _getStarCarriers() {
        // Get the player who owns the star.
        let player = this._getStarPlayer();
                
        if (!player)
            return [];

        let carriersAtStar = player.carriers.filter(x => x.orbiting === this.data._id);

        return carriersAtStar;
    }

    _isOutOfScanningRange() {
        // These may be undefined, if so it means that they are out of scanning range.
        return typeof this.data.economy === 'undefined' || 
            typeof this.data.industry === 'undefined' || 
            typeof this.data.science === 'undefined';
    }

    setup(data, players) {
        this.data = data;
        this.players = players;
    }

    draw() {
        this.container.removeChildren();

        if (this.data.warpGate) {
            this.drawWarpGate();
        }

        this.drawColour();

        // If the star has a carrier, draw that instead of the star circle.
        if (this._getStarCarriers().length)
            this.drawCarrier();
        else
            this.drawStar();

        this.drawHalo();
        this.drawName();
        this.drawGarrison();
        //this.drawPlayerName();
        
        if (this.isSelected) {
            this.drawInfrastructure();
            this.drawScanningRange();
            this.drawHyperspaceRange();
        }
    }

    drawStar() {
        let graphics = new PIXI.Graphics();

        if (this._isOutOfScanningRange()) {
            graphics.lineStyle(1, 0xFFFFFF);
            graphics.beginFill(0x000000);
        } else {
            graphics.lineStyle(0);
            graphics.beginFill(0xFFFFFF);
        }

        graphics.drawCircle(this.data.location.x, this.data.location.y, 2);
        graphics.endFill();
        
        this.container.addChild(graphics);
    }

    drawColour() {
        // Get the player who owns the star.
        let player = this._getStarPlayer();
        
        if (!player)
            return;
            
        let graphics = new PIXI.Graphics();

        graphics.lineStyle(2, player.colour.value);
        graphics.drawCircle(this.data.location.x, this.data.location.y, 4);

        this.container.addChild(graphics);
    }
    
    drawWarpGate() {
        let graphics = new PIXI.Graphics();

        graphics.lineStyle(1, 0xFFFFFF);
        graphics.drawStar(this.data.location.x, this.data.location.y, 12, 6, 5);

        this.container.addChild(graphics);
    }

    drawCarrier() {
        let starCarriers = this._getStarCarriers();

        if (!starCarriers.length)
            return;
            
        let carrier = new Carrier(this.container, starCarriers[0]);

        carrier.draw();
    }

    drawHalo() {
        let graphics = new PIXI.Graphics();

        graphics.lineStyle(1, 0xFFFFFF, 0.1);
        graphics.drawCircle(this.data.location.x, this.data.location.y, this.data.naturalResources / 2);

        this.container.addChild(graphics);
    }

    drawName() {
        let text = new PIXI.Text(this.data.name, {
            fontSize: 4,
            fill: 0xFFFFFF
        });

        text.x = this.data.location.x - (text.width / 2);
        text.y = this.data.location.y + 7;
        text.resolution = 10;

        this.container.addChild(text);
    }

    drawGarrison() {
        if (!this.data.garrison) return;

        let text = new PIXI.Text(this.data.garrison, {
            fontSize: 4,
            fill: 0xFFFFFF
        });

        text.x = this.data.location.x - (text.width / 2);
        text.y = this.data.location.y + 12;
        text.resolution = 10;

        this.container.addChild(text);
    }

    drawInfrastructure() {
        if (!this.data.ownedByPlayerId) return; // TODO Does abandoning stars destroy ALL infrastructure?
        if (this._isOutOfScanningRange()) return;

        let text = new PIXI.Text(`${this.data.economy} ${this.data.industry} ${this.data.science}`, {
            fontSize: 4,
            fill: 0xFFFFFF
        });

        text.x = this.data.location.x - (text.width / 2);
        text.y = this.data.location.y - 12;
        text.resolution = 10;

        this.container.addChild(text);
    }

    drawPlayerName() {
        // Get the player who owns the star.
        let player = this._getStarPlayer();
        
        if (!player)
            return;

        let text = new PIXI.Text(player.alias, {
            fontSize: 4,
            fill: 0xFFFFFF
        });

        text.x = this.data.location.x - (text.width / 2);
        text.y = this.data.location.y + 22;
        text.resolution = 10;

        this.container.addChild(text);
    }

    drawScanningRange() {
        // Get the player who owns the star.
        let player = this._getStarPlayer();
        
        if (!player)
            return;
            
        let graphics = new PIXI.Graphics();

        let radius = ((player.research.scanning || 1) + 2) * 30;

        graphics.lineStyle(1, 0xFFFFFF, 0.3);
        graphics.drawStar(this.data.location.x, this.data.location.y, radius, radius, radius - 1);

        this.container.addChild(graphics);
    }

    drawHyperspaceRange() {
        // Get the player who owns the star.
        let player = this._getStarPlayer();
        
        if (!player)
            return;
            
        let graphics = new PIXI.Graphics();

        let radius = ((player.research.hyperspace || 1) + 3) * 30;

        graphics.lineStyle(1, 0xFFFFFF, 0.3);
        graphics.drawStar(this.data.location.x, this.data.location.y, radius, radius, radius - 2);

        this.container.addChild(graphics);
    }

    onClicked(e) {
        this.isSelected = !this.isSelected;
        
        this.emit('onSelected', this);
    }
}

export default Star;
