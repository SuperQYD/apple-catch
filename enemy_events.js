var enemy_events = {

  init: function(that){
    
    that.enemy_events_state = {};
    that.enemy_events_state.hedgehog = false;
    that.enemy_events_state.beehive = false;
    that.enemy_events_state.raven = false;
    that.enemy_events_state.egg = false;
    that.enemy_events_state.yolk = false;
    that.enemy_events_state.canon = false;
    that.enemy_events_state.UFO = false;
    that.enemy_events_state.UFO_beam = false;

    that.UFO_round = 0;
    that.UFO_move = false;
 
    that.canon_ball = game.add.sprite(0, 700, 'canon-ball');
    that.canon_ball.scale.y = 0.001;
    that.canon_ball.scale.x = 0.001;

  },

  spawnHedgehog: function(that){
    that.enemy_events_state.hedgehog = true;
    that.hedgehog = that.enemy.create(0, 600, 'hedgehog');
    that.hedgehog.body.gravity.y = 700;
    that.hedgehog.body.bounce.y = 0.2;
    that.hedgehog.scale.x = 0.3;
    that.hedgehog.scale.y = 0.3;
    that.hedgehog.animations.add('walk', [0, 1, 2, 1], 20, true);
    that.hedgehog.animations.play('walk');
    game.add.tween(that.hedgehog).to( { x: 1600 }, 5000, Phaser.Easing.Linear.Out, true);
    game.time.events.add(Phaser.Timer.SECOND * 7, this.__killHedgehog, this, that);
  },

  __killHedgehog: function(that){
    that.enemy_events_state.hedgehog = false;
    that.hedgehog.kill();
  },

  spawnBeehive: function(that){
    that.enemy_events_state.beehive = true;
    that.beehive = that.enemy.create(800, 300, 'beehive');
    that.beehive.anchor.set(0.5, 0);
    that.beehive.scale.x = 0.02;
    that.beehive.scale.y = 0.02;
    that.beehive.animations.add('buzz', [0, 1, 2, 3, 2, 1], 10, true);
    that.beehive.animations.play('buzz');
    game.add.tween(that.beehive.scale).to( { x: 0.2}, 3500, Phaser.Easing.Linear.Out, true)
    game.add.tween(that.beehive.scale).to( { y: 0.2}, 3500, Phaser.Easing.Linear.Out, true)
    game.time.events.add(Phaser.Timer.SECOND * 5.5, this.__dropBeehive, this, that);
    game.time.events.add(Phaser.Timer.SECOND * 7, this.__killBeehive, this, that);
  },

  __dropBeehive: function(that){
    that.beehive.body.gravity.y = 350;
  },
  
  __killBeehive: function(that){
    that.enemy_events_state.beehive = false;
    that.beehive.kill();
  },

  spawnRaven: function(that){
    that.enemy_events_state.raven = true;
    that.raven = that.enemy.create(1600, 500, 'raven');
    that.raven.anchor.set(-0.25, 1.25)
    that.raven.angle = 25;
    that.raven.animations.add('flap', [0, 1], 8, true);
    that.raven.animations.play('flap');
    game.add.tween(that.raven).to( { x: -200 }, 5000, Phaser.Easing.Linear.Out, true);
    game.time.events.add(Phaser.Timer.SECOND * 12, this.__killRaven, this, that);
  },

  updateRaven: function(that){
    if(that.enemy_events_state.raven == true){
      newtonPos = Math.round(that.newton.x/100) * 100
      ravenPos = Math.round(that.raven.x/100) * 100
      if(newtonPos == ravenPos && that.enemy_events_state.egg == false) {
        this.dropEgg(that);
      }
    }
  },

  dropEgg: function(that){
    that.egg = that.enemy.create(that.raven.x, that.raven.y, 'egg');
    that.egg.animations.add('crack', [0, 1], 10, false);
    that.egg.anchor.set(0.5, 0.5);
    that.egg.scale.x = 0.05;
    that.egg.scale.y = 0.05;
    that.egg.body.gravity.y = 350;
    game.add.tween(that.egg.scale).to( { x: 0.5 }, 250, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.egg.scale).to( { y: 0.5 }, 250, Phaser.Easing.Linear.Out, true);
    that.enemy_events_state.egg = true;
    game.time.events.add(Phaser.Timer.SECOND * 1.3, this.__crackEgg, this, that);
  },

  __crackEgg: function(that){
    that.enemy_events_state.yolk = true;
    that.yolk = game.add.sprite(that.egg.x, that.egg.y + 56, 'yolk');
    that.yolk.scale.x = 0.05;
    that.yolk.scale.y = 0.05;
    that.yolk.anchor.set(0.5, 0.5);
    that.egg.animations.play('crack');
    that.egg.kill();
    game.add.tween(that.yolk.scale).to( { y: 1 }, 1000, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.yolk.scale).to( { x: 1 }, 1000, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.yolk).to( { alpha: 0 }, 10000, Phaser.Easing.Linear.Out, true);
  },
  
  __killRaven: function(that){
   that.enemy_events_state.raven = false;
   that.enemy_events_state.egg = false;
   that.enemy_events_state.yolk = false;

   that.raven.kill();
   that.yolk.kill();
   },

  spawnCanonBall: function(that) {
    that.canon_ball.x = that.newton.x;
    that.canon_fire.play();
    game.add.tween(that.canon_ball).to( { y: 200 }, 7500, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.canon_ball.scale).to( { x: 0.25 }, 7500, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.canon_ball.scale).to( { y: 0.25 }, 7500, Phaser.Easing.Linear.Out, true);
    game.time.events.add(Phaser.Timer.SECOND * 8.5, this.__dropCanonBall, this, that);
  },

  __dropCanonBall: function(that) {
    that.shadow = game.add.sprite(that.canon_ball.x, 850, 'shadow');
    that.shadow.scale.x = 0.1;
    that.shadow.scale.y = 0.1;
    that.shadow.alpha = 0.1;
    that.shadow.anchor.set(0.5, 0.5);
    game.add.tween(that.shadow.scale).to( { x: 1.9 }, 1000, Phaser.Easing.Linear.Out, true);  
    game.add.tween(that.shadow.scale).to( { y: 1.9 }, 1000, Phaser.Easing.Linear.Out, true);  
    game.add.tween(that.shadow).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.Out, true);  
    
    game.add.tween(that.shadow.scale).to( { x: 1.7 }, 1000, Phaser.Easing.Linear.Out, true);  
    game.add.tween(that.shadow.scale).to( { y: 1.7 }, 1000, Phaser.Easing.Linear.Out, true);  
    game.time.events.add(Phaser.Timer.SECOND * 1, this.__killShadow, this, that);
    that.big_canon_ball = that.enemy.create(that.canon_ball.x, -1000, 'canon-ball');
    that.big_canon_ball.anchor.set(0.5, 0.5);
    that.big_canon_ball.scale.x = 2;
    that.big_canon_ball.scale.y = 2;
    game.add.tween(that.big_canon_ball).to( { y: 1100 }, 1500, Phaser.Easing.Linear.Out, true);
    game.time.events.add(Phaser.Timer.SECOND * 2.5, this.__killCanonBall, this, that);
  },

  __killShadow: function(that){
    game.add.tween(that.shadow.scale).to( { x: 0  }, 150, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.shadow.scale).to( { y: 0  }, 150, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.shadow).to( { alpha: 0 }, 150, Phaser.Easing.Linear.Out, true);
  },

  __killCanonBall: function(that) {
    that.canon_ball.kill();
    that.big_canon_ball.kill();
    that.shadow.kill();
  },

  spawnUFO: function(that) {
    that.enemy_events_state.UFO = true;
    that.UFO = game.add.group();
    that.UFO.enableBody = true;
    that.UFO_horizontal_shadow = that.UFO.create(800, 850, 'ufo-horizontal-shadow');
    that.UFO_vertical_shadow = that.UFO.create(800, 350, 'ufo-vertical-shadow');
    that.UFO_horizontal_shadow.alpha = 0.75;
    that.UFO_horizontal_shadow.anchor.set(0.5, 0.5);
    that.UFO_vertical_shadow.anchor.set(0.5, 0.5);
    that.UFO_horizontal_shadow.animations.add('light-up', [0, 1], 5, true);
    that.UFO_horizontal_shadow.animations.play('light-up');
    that.UFO.moving = true;
  },

  __moveUFO: function(that) {
    that.UFO_move = true;
    var newton_position = that.newton.x;
    var random_time = (Math.floor(Math.random() * 5) + 1);
    game.add.tween(that.UFO_horizontal_shadow).to( { x: newton_position }, random_time * 1000, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.UFO_vertical_shadow).to( { x: newton_position }, random_time * 1000, Phaser.Easing.Linear.Out, true);
    game.time.events.add(Phaser.Timer.SECOND * random_time + 1, this.__stopUFO, this, that);
  },

  __stopUFO: function(that) {
    that.UFO_move = false;
    if(that.UFO_round == 1){
      game.time.events.add(Phaser.Timer.SECOND * 3, this.__chargeBeam, this, that);
      game.time.events.add(Phaser.Timer.SECOND * 5, this.__fireBeam, this, that);
    }
  },

  __fireBeam: function(that) {
    that.beam = that.UFO.create(that.UFO_horizontal_shadow.x, -150, 'beam');
    that.enemy_events_state.UFO_beam = true;
    that.beam.anchor.setTo(0.5, 0);
    that.beam.alpha = 0;
    that.beam.scale.x = 0.01;
    that.beam.scale.y = 0.01;
    that.blue_light = that.UFO.create(that.beam.x, that.beam.y + 600, 'blue-light');
    that.blue_light.anchor.setTo(0.5, 0.5);
    that.blue_light.alpha = 0;
    that.blue_light.scale.x = 2.5;
    that.blue_light.scale.y = 2.5;
    game.add.tween(that.beam).to( { alpha: 1 }, 3000, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.blue_light).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.UFO_horizontal_shadow).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.UFO_vertical_shadow).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.beam.scale).to( { x: 1 }, 3000, Phaser.Easing.Linear.Out, true);
    game.add.tween(that.beam.scale).to( { y: 1 }, 750, Phaser.Easing.Linear.Out, true);
  },

  __chargeBeam: function(that) {

   that.lightEmitter = game.add.emitter(900, 850, 100);
   that.lightEmitter.width = 200;
   that.lightEmitter.makeParticles('corona');
   that.lightEmitter.setAlpha(0.3, 0.8);
   that.game.world.addAt(that.lightEmitter, 0);
   that.lightEmitter.minParticleScale = 0.05;
   that.lightEmitter.maxParticleScale = 0.35;
   that.lightEmitter.setYSpeed(-750, -1000);
   that.lightEmitter.setXSpeed(-100, 100);
   that.lightEmitter.minRotation = -10;
   that.lightEmitter.maxRotation = 10;
   that.lightEmitter.x = that.UFO_horizontal_shadow.x;
   that.lightEmitter.start(false, 1600, 20, 0);
  },


  updateUFO: function(that) {
    if(that.enemy_events_state.UFO == true && that.UFO_round < 1){
      if(that.UFO_move == false){
        this.__moveUFO(that);
        that.UFO_round += 1;
      }
    }
  }
};