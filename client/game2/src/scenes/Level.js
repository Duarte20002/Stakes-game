let reinforceMode = false;
let alreadyReinforced = false;
let selectedCard = null;
let isMyTurn = false;
let highlightedAdjacents = [];
let selectedZone;
let defendingZone;

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// enterKey
		const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

		// map_Game_final
		const map_Game_final = this.add.image(-9, -3, "Map_Game_final NEW");
		map_Game_final.scaleX = 0.6766854815017886;
		map_Game_final.scaleY = 0.6840681217120615;
		map_Game_final.setOrigin(0.001494816372490019, 0.008755607644634386);

		// pass_Turn
		const pass_Turn = this.add.image(1054, 666, "Pass Turn");
		pass_Turn.setInteractive(this.input.makePixelPerfect());
		pass_Turn.scaleX = 0.3;
		pass_Turn.scaleY = 0.3;

		// zones
		const zones = this.add.container(0, 0);

		// zone_1
		const zone_1 = this.add.container(0, 0);
		zones.add(zone_1);

		// zona_1
		const zona_1 = this.add.image(150, 520, "Zona 1");
		zona_1.setInteractive(this.input.makePixelPerfect());
		zone_1.add(zona_1);

		// neutral_Piece_1
		const neutral_Piece_1 = new Neutral_Piece(this, 135, 510);
		zone_1.add(neutral_Piece_1);

		// zone_2
		const zone_2 = this.add.container(0, 0);
		zones.add(zone_2);

		// zona_2
		const zona_2 = this.add.image(134, 425, "Zona 2");
		zona_2.setInteractive(this.input.makePixelPerfect());
		zone_2.add(zona_2);

		// neutral_Piece_2
		const neutral_Piece_2 = new Neutral_Piece(this, 145, 393);
		zone_2.add(neutral_Piece_2);

		// zone_3
		const zone_3 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_3);

		// zona_3
		const zona_3 = this.add.image(159, 1, "Zona 3");
		zona_3.setInteractive(this.input.makePixelPerfect());
		zone_3.add(zona_3);

		// neutral_Piece_3
		const neutral_Piece_3 = new Neutral_Piece(this, 139, -7);
		zone_3.add(neutral_Piece_3);

		// zone_4
		const zone_4 = this.add.container(0, 0);
		zones.add(zone_4);

		// zona_4
		const zona_4 = this.add.image(199, 302, "Zona 4");
		zona_4.setInteractive(this.input.makePixelPerfect());
		zone_4.add(zona_4);

		// neutral_Piece_4
		const neutral_Piece_4 = new Neutral_Piece(this, 254, 302);
		zone_4.add(neutral_Piece_4);

		// zone_5
		const zone_5 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_5);

		// zona_5
		const zona_5 = this.add.image(379.55285835266113, 81.1357421875, "Zona 5");
		zona_5.setInteractive(this.input.makePixelPerfect());
		zone_5.add(zona_5);

		// neutral_Piece_5
		const neutral_Piece_5 = new Neutral_Piece(this, 373, 88);
		zone_5.add(neutral_Piece_5);

		// zone_6
		const zone_6 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_6);

		// zona_6
		const zona_6 = this.add.image(352.55285835266113, 203.1357421875, "Zona 6");
		zona_6.setInteractive(this.input.makePixelPerfect());
		zone_6.add(zona_6);

		// neutral_Piece_6
		const neutral_Piece_6 = new Neutral_Piece(this, 340, 180);
		zone_6.add(neutral_Piece_6);

		// zone_7
		const zone_7 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_7);

		// zona_7
		const zona_7 = this.add.image(460.55285835266113, 178.1357421875, "Zona 7");
		zona_7.setInteractive(this.input.makePixelPerfect());
		zone_7.add(zona_7);

		// neutral_Piece_7
		const neutral_Piece_7 = new Neutral_Piece(this, 448, 156);
		zone_7.add(neutral_Piece_7);

		// zone_8
		const zone_8 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_8);

		// zona_8
		const zona_8 = this.add.image(455, 295, "Zona 8 NEW");
		zona_8.setInteractive(this.input.makePixelPerfect());
		zone_8.add(zona_8);

		// neutral_Piece_8
		const neutral_Piece_8 = new Neutral_Piece(this, 449, 262);
		zone_8.add(neutral_Piece_8);

		// zone_9
		const zone_9 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_9);

		// zona_9
		const zona_9 = this.add.image(202.55285835266113, -105.8642578125, "Zona 9");
		zona_9.setInteractive(this.input.makePixelPerfect());
		zone_9.add(zona_9);

		// angel_Piece_1
		const angel_Piece_1 = new Angel_Piece(this, 173, -161);
		zone_9.add(angel_Piece_1);

		// zone_10
		const zone_10 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_10);

		// zona_10
		const zona_10 = this.add.image(296.55285835266113, -136.8642578125, "Zona 10");
		zona_10.setInteractive(this.input.makePixelPerfect());
		zone_10.add(zona_10);

		// neutral_Piece_10
		const neutral_Piece_10 = new Neutral_Piece(this, 307, -148);
		zone_10.add(neutral_Piece_10);

		// zone_11
		const zone_11 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_11);

		// zona_11
		const zona_11 = this.add.image(356.55285835266113, -48.8642578125, "Zona 11");
		zona_11.setInteractive(this.input.makePixelPerfect());
		zone_11.add(zona_11);

		// neutral_Piece_11
		const neutral_Piece_11 = new Neutral_Piece(this, 367, -62);
		zone_11.add(neutral_Piece_11);

		// zone_12
		const zone_12 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_12);

		// zona_12
		const zona_12 = this.add.image(453.55285835266113, 48.1357421875, "Zona 13");
		zona_12.setInteractive(this.input.makePixelPerfect());
		zone_12.add(zona_12);

		// neutral_Piece_12
		const neutral_Piece_12 = new Neutral_Piece(this, 459.55285835266113, 47.1357421875);
		zone_12.add(neutral_Piece_12);

		// zone_13
		const zone_13 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_13);

		// zona_13
		const zona_13 = this.add.image(481, -83, "Zona 12");
		zona_13.setInteractive(this.input.makePixelPerfect());
		zone_13.add(zona_13);

		// neutral_Piece_13
		const neutral_Piece_13 = new Neutral_Piece(this, 474, -84);
		zone_13.add(neutral_Piece_13);

		// zone_14
		const zone_14 = this.add.container(-26.552858352661133, 299.8642578125);
		zones.add(zone_14);

		// zona_14
		const zona_14 = this.add.image(552.5528583526611, 39.1357421875, "Zona 14");
		zona_14.setInteractive(this.input.makePixelPerfect());
		zone_14.add(zona_14);

		// neutral_Piece_14
		const neutral_Piece_14 = new Neutral_Piece(this, 567, 24);
		zone_14.add(neutral_Piece_14);

		// zone_15
		const zone_15 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_15);

		// zona_15
		const zona_15 = this.add.image(541.5528583526611, 167.1357421875, "Zona 15");
		zona_15.setInteractive(this.input.makePixelPerfect());
		zone_15.add(zona_15);

		// neutral_Piece_15
		const neutral_Piece_15 = new Neutral_Piece(this, 521, 147);
		zone_15.add(neutral_Piece_15);

		// zone_16
		const zone_16 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_16);

		// zona_16
		const zona_16 = this.add.image(632.5528583526611, 128.1357421875, "Zona 18");
		zona_16.setInteractive(this.input.makePixelPerfect());
		zone_16.add(zona_16);

		// neutral_Piece_16
		const neutral_Piece_16 = new Neutral_Piece(this, 630.5528583526611, 120.1357421875);
		zone_16.add(neutral_Piece_16);

		// zone_17
		const zone_17 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_17);

		// zona_17
		const zona_17 = this.add.image(653, 289, "Zona 16 NEW");
		zona_17.setInteractive(this.input.makePixelPerfect());
		zone_17.add(zona_17);

		// neutral_Piece_17
		const neutral_Piece_17 = new Neutral_Piece(this, 658, 249);
		zone_17.add(neutral_Piece_17);

		// zone_18
		const zone_18 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_18);

		// zona_18
		const zona_18 = this.add.image(709.5528583526611, 203.1357421875, "Zona 17");
		zona_18.setInteractive(this.input.makePixelPerfect());
		zone_18.add(zona_18);

		// neutral_Piece_18
		const neutral_Piece_18 = new Neutral_Piece(this, 706, 190);
		zone_18.add(neutral_Piece_18);

		// zone_19
		const zone_19 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_19);

		// zona_19
		const zona_19 = this.add.image(543.5528583526611, -119.8642578125, "Zona 19");
		zona_19.setInteractive(this.input.makePixelPerfect());
		zone_19.add(zona_19);

		// neutral_Piece_19
		const neutral_Piece_19 = new Neutral_Piece(this, 554, -150);
		zone_19.add(neutral_Piece_19);

		// zone_20
		const zone_20 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_20);

		// zona_20
		const zona_20 = this.add.image(581.5528583526611, -55.8642578125, "Zona 20");
		zona_20.setInteractive(this.input.makePixelPerfect());
		zone_20.add(zona_20);

		// neutral_Piece_20
		const neutral_Piece_20 = new Neutral_Piece(this, 593, -78);
		zone_20.add(neutral_Piece_20);

		// zone_21
		const zone_21 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_21);

		// zona_21
		const zona_21 = this.add.image(655.5528583526611, -104.8642578125, "Zona 21");
		zona_21.setInteractive(this.input.makePixelPerfect());
		zone_21.add(zona_21);

		// neutral_Piece_21
		const neutral_Piece_21 = new Neutral_Piece(this, 666, -134);
		zone_21.add(neutral_Piece_21);

		// zone_22
		const zone_22 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_22);

		// zona_22
		const zona_22 = this.add.image(758.5528583526611, -60.8642578125, "Zona 22");
		zona_22.setInteractive(this.input.makePixelPerfect());
		zone_22.add(zona_22);

		// neutral_Piece_22
		const neutral_Piece_22 = new Neutral_Piece(this, 775, -108);
		zone_22.add(neutral_Piece_22);

		// zone_23
		const zone_23 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_23);

		// zona_23
		const zona_23 = this.add.image(710.5528583526611, -46.8642578125, "Zona 23");
		zona_23.setInteractive(this.input.makePixelPerfect());
		zone_23.add(zona_23);

		// neutral_Piece_23
		const neutral_Piece_23 = new Neutral_Piece(this, 708, -77);
		zone_23.add(neutral_Piece_23);

		// zone_24
		const zone_24 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_24);

		// zona_24
		const zona_24 = this.add.image(644.5528583526611, 7.1357421875, "Zona 24");
		zona_24.setInteractive(this.input.makePixelPerfect());
		zone_24.add(zona_24);

		// neutral_Piece_24
		const neutral_Piece_24 = new Neutral_Piece(this, 657, -14);
		zone_24.add(neutral_Piece_24);

		// zone_25
		const zone_25 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_25);

		// zona_25
		const zona_25 = this.add.image(702.5528583526611, 89.1357421875, "Zona 26");
		zona_25.setInteractive(this.input.makePixelPerfect());
		zone_25.add(zona_25);

		// neutral_Piece_25
		const neutral_Piece_25 = new Neutral_Piece(this, 709, 69);
		zone_25.add(neutral_Piece_25);

		// zone_26
		const zone_26 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_26);

		// zona_26
		const zona_26 = this.add.image(767.5528583526611, 9.1357421875, "Zona 25");
		zona_26.setInteractive(this.input.makePixelPerfect());
		zone_26.add(zona_26);

		// neutral_Piece_26
		const neutral_Piece_26 = new Neutral_Piece(this, 765, -10);
		zone_26.add(neutral_Piece_26);

		// zone_27
		const zone_27 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_27);

		// zona_27
		const zona_27 = this.add.image(829.5528583526611, 53.1357421875, "Zona 27");
		zona_27.setInteractive(this.input.makePixelPerfect());
		zone_27.add(zona_27);

		// neutral_Piece_27
		const neutral_Piece_27 = new Neutral_Piece(this, 828, 27);
		zone_27.add(neutral_Piece_27);

		// zone_28
		const zone_28 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_28);

		// zona_28
		const zona_28 = this.add.image(932.5528583526611, 5.1357421875, "Zona 28");
		zona_28.setInteractive(this.input.makePixelPerfect());
		zone_28.add(zona_28);

		// neutral_Piece_28
		const neutral_Piece_28 = new Neutral_Piece(this, 941, -16);
		zone_28.add(neutral_Piece_28);

		// zone_29
		const zone_29 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_29);

		// zona_29
		const zona_29 = this.add.image(868.5528583526611, 115.1357421875, "Zona 29");
		zona_29.setInteractive(this.input.makePixelPerfect());
		zone_29.add(zona_29);

		// neutral_Piece_29
		const neutral_Piece_29 = new Neutral_Piece(this, 871, 93);
		zone_29.add(neutral_Piece_29);

		// zone_30
		const zone_30 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_30);

		// zona_30
		const zona_30 = this.add.image(806.5528583526611, 243.1357421875, "Zona 30");
		zona_30.setInteractive(this.input.makePixelPerfect());
		zone_30.add(zona_30);

		// neutral_Piece_30
		const neutral_Piece_30 = new Neutral_Piece(this, 822, 221);
		zone_30.add(neutral_Piece_30);

		// zone_31
		const zone_31 = this.add.container(-26.552858352661133, 300.8642578125);
		zones.add(zone_31);

		// zona_31
		const zona_31 = this.add.image(840.5528583526611, 205.1357421875, "Zona 31");
		zona_31.setInteractive(this.input.makePixelPerfect());
		zone_31.add(zona_31);

		// neutral_Piece_31
		const neutral_Piece_31 = new Neutral_Piece(this, 871, 176);
		zone_31.add(neutral_Piece_31);

		// zone_32
		const zone_32 = this.add.container(-226.97267150878906, 698.1469116210938);
		zones.add(zone_32);

		// zona_32
		const zona_32 = this.add.image(1161.972671508789, -234.14691162109375, "Zona 32");
		zona_32.setInteractive(this.input.makePixelPerfect());
		zone_32.add(zona_32);

		// demon_Piece
		const demon_Piece = new Demon_Piece(this, 1188, -271);
		zone_32.add(demon_Piece);

		// cards
		const cards = this.add.container(0, 0);

		// card01
		const card01 = this.add.image(1153, 23, "Card +2");
		card01.setInteractive(this.input.makePixelPerfect());
		card01.scaleX = 0.38;
		card01.scaleY = 0.38;
		card01.setOrigin(0.0009487163708776516, 0.00048748316692433127);
		cards.add(card01);

		// card02
		const card02 = this.add.image(1153, 193, "Card +2");
		card02.setInteractive(this.input.makePixelPerfect());
		card02.scaleX = 0.38;
		card02.scaleY = 0.38;
		card02.setOrigin(0.0009487163708776516, 0.00048748316692433127);
		cards.add(card02);

		// card03
		const card03 = this.add.image(1153, 363, "Card +2");
		card03.setInteractive(this.input.makePixelPerfect());
		card03.scaleX = 0.38;
		card03.scaleY = 0.38;
		card03.setOrigin(0.0009487163708776516, 0.00048748316692433127);
		cards.add(card03);

		// card04
		const card04 = this.add.image(1153, 533, "Card +2");
		card04.setInteractive(this.input.makePixelPerfect());
		card04.scaleX = 0.38;
		card04.scaleY = 0.38;
		card04.setOrigin(0.0009487163708776516, 0.00048748316692433127);
		cards.add(card04);

		// window
		const window = this.add.container(530, 319);

		// window_1
		const window_1 = this.add.image(80, -5, "Window");
		window_1.setInteractive(this.input.makePixelPerfect());
		window_1.scaleX = 0.6;
		window_1.scaleY = 0.6;
		window.add(window_1);

		// plus
		const plus = this.add.image(222, 40, "Plus");
		plus.setInteractive(this.input.makePixelPerfect());
		plus.scaleX = 0.6;
		plus.scaleY = 0.6;
		window.add(plus);

		// minus
		const minus = this.add.image(-75, 40, "Minus");
		minus.setInteractive(this.input.makePixelPerfect());
		minus.scaleX = 0.6;
		minus.scaleY = 0.6;
		window.add(minus);

		// text_2
		const text_2 = this.add.text(13, 17, "", {});
		text_2.scaleX = 0.2;
		text_2.scaleY = 0.2;
		text_2.text = "99";
		text_2.setStyle({ "align": "center", "fixedWidth":599,"fixedHeight":234,"fontSize": "250px", "fontStyle": "bold" });
		window.add(text_2);

		// close_Window
		const close_Window = this.add.image(287, -110, "Close Window");
		close_Window.setInteractive(this.input.makePixelPerfect());
		close_Window.scaleX = 0.6;
		close_Window.scaleY = 0.6;
		window.add(close_Window);

		// lists
		const stars = [];

		this.pass_Turn = pass_Turn;
		this.zona_1 = zona_1;
		this.neutral_Piece_1 = neutral_Piece_1;
		this.zone_1 = zone_1;
		this.zona_2 = zona_2;
		this.neutral_Piece_2 = neutral_Piece_2;
		this.zone_2 = zone_2;
		this.zona_3 = zona_3;
		this.neutral_Piece_3 = neutral_Piece_3;
		this.zone_3 = zone_3;
		this.zona_4 = zona_4;
		this.neutral_Piece_4 = neutral_Piece_4;
		this.zone_4 = zone_4;
		this.zona_5 = zona_5;
		this.neutral_Piece_5 = neutral_Piece_5;
		this.zone_5 = zone_5;
		this.zona_6 = zona_6;
		this.neutral_Piece_6 = neutral_Piece_6;
		this.zone_6 = zone_6;
		this.zona_7 = zona_7;
		this.neutral_Piece_7 = neutral_Piece_7;
		this.zone_7 = zone_7;
		this.zona_8 = zona_8;
		this.neutral_Piece_8 = neutral_Piece_8;
		this.zone_8 = zone_8;
		this.zona_9 = zona_9;
		this.zone_9 = zone_9;
		this.zona_10 = zona_10;
		this.neutral_Piece_10 = neutral_Piece_10;
		this.zone_10 = zone_10;
		this.zona_11 = zona_11;
		this.neutral_Piece_11 = neutral_Piece_11;
		this.zone_11 = zone_11;
		this.zona_12 = zona_12;
		this.neutral_Piece_12 = neutral_Piece_12;
		this.zone_12 = zone_12;
		this.zona_13 = zona_13;
		this.neutral_Piece_13 = neutral_Piece_13;
		this.zone_13 = zone_13;
		this.zona_14 = zona_14;
		this.neutral_Piece_14 = neutral_Piece_14;
		this.zone_14 = zone_14;
		this.zona_15 = zona_15;
		this.neutral_Piece_15 = neutral_Piece_15;
		this.zone_15 = zone_15;
		this.zona_16 = zona_16;
		this.neutral_Piece_16 = neutral_Piece_16;
		this.zone_16 = zone_16;
		this.zona_17 = zona_17;
		this.neutral_Piece_17 = neutral_Piece_17;
		this.zone_17 = zone_17;
		this.zona_18 = zona_18;
		this.neutral_Piece_18 = neutral_Piece_18;
		this.zone_18 = zone_18;
		this.zona_19 = zona_19;
		this.neutral_Piece_19 = neutral_Piece_19;
		this.zone_19 = zone_19;
		this.zona_20 = zona_20;
		this.neutral_Piece_20 = neutral_Piece_20;
		this.zone_20 = zone_20;
		this.zona_21 = zona_21;
		this.neutral_Piece_21 = neutral_Piece_21;
		this.zone_21 = zone_21;
		this.zona_22 = zona_22;
		this.neutral_Piece_22 = neutral_Piece_22;
		this.zone_22 = zone_22;
		this.zona_23 = zona_23;
		this.neutral_Piece_23 = neutral_Piece_23;
		this.zone_23 = zone_23;
		this.zona_24 = zona_24;
		this.neutral_Piece_24 = neutral_Piece_24;
		this.zone_24 = zone_24;
		this.zona_25 = zona_25;
		this.neutral_Piece_25 = neutral_Piece_25;
		this.zone_25 = zone_25;
		this.zona_26 = zona_26;
		this.neutral_Piece_26 = neutral_Piece_26;
		this.zone_26 = zone_26;
		this.zona_27 = zona_27;
		this.neutral_Piece_27 = neutral_Piece_27;
		this.zone_27 = zone_27;
		this.zona_28 = zona_28;
		this.neutral_Piece_28 = neutral_Piece_28;
		this.zone_28 = zone_28;
		this.zona_29 = zona_29;
		this.neutral_Piece_29 = neutral_Piece_29;
		this.zone_29 = zone_29;
		this.zona_30 = zona_30;
		this.neutral_Piece_30 = neutral_Piece_30;
		this.zone_30 = zone_30;
		this.zona_31 = zona_31;
		this.neutral_Piece_31 = neutral_Piece_31;
		this.zone_31 = zone_31;
		this.zona_32 = zona_32;
		this.demon_Piece = demon_Piece;
		this.zone_32 = zone_32;
		this.zones = zones;
		this.card01 = card01;
		this.card02 = card02;
		this.card03 = card03;
		this.card04 = card04;
		this.cards = cards;
		this.window_1 = window_1;
		this.plus = plus;
		this.minus = minus;
		this.text_2 = text_2;
		this.close_Window = close_Window;
		this.window = window;
		this.enterKey = enterKey;
		this.stars = stars;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	pass_Turn;
	/** @type {Phaser.GameObjects.Image} */
	zona_1;
	/** @type {Neutral_Piece} */
	neutral_Piece_1;
	/** @type {Phaser.GameObjects.Container} */
	zone_1;
	/** @type {Phaser.GameObjects.Image} */
	zona_2;
	/** @type {Neutral_Piece} */
	neutral_Piece_2;
	/** @type {Phaser.GameObjects.Container} */
	zone_2;
	/** @type {Phaser.GameObjects.Image} */
	zona_3;
	/** @type {Neutral_Piece} */
	neutral_Piece_3;
	/** @type {Phaser.GameObjects.Container} */
	zone_3;
	/** @type {Phaser.GameObjects.Image} */
	zona_4;
	/** @type {Neutral_Piece} */
	neutral_Piece_4;
	/** @type {Phaser.GameObjects.Container} */
	zone_4;
	/** @type {Phaser.GameObjects.Image} */
	zona_5;
	/** @type {Neutral_Piece} */
	neutral_Piece_5;
	/** @type {Phaser.GameObjects.Container} */
	zone_5;
	/** @type {Phaser.GameObjects.Image} */
	zona_6;
	/** @type {Neutral_Piece} */
	neutral_Piece_6;
	/** @type {Phaser.GameObjects.Container} */
	zone_6;
	/** @type {Phaser.GameObjects.Image} */
	zona_7;
	/** @type {Neutral_Piece} */
	neutral_Piece_7;
	/** @type {Phaser.GameObjects.Container} */
	zone_7;
	/** @type {Phaser.GameObjects.Image} */
	zona_8;
	/** @type {Neutral_Piece} */
	neutral_Piece_8;
	/** @type {Phaser.GameObjects.Container} */
	zone_8;
	/** @type {Phaser.GameObjects.Image} */
	zona_9;
	/** @type {Phaser.GameObjects.Container} */
	zone_9;
	/** @type {Phaser.GameObjects.Image} */
	zona_10;
	/** @type {Neutral_Piece} */
	neutral_Piece_10;
	/** @type {Phaser.GameObjects.Container} */
	zone_10;
	/** @type {Phaser.GameObjects.Image} */
	zona_11;
	/** @type {Neutral_Piece} */
	neutral_Piece_11;
	/** @type {Phaser.GameObjects.Container} */
	zone_11;
	/** @type {Phaser.GameObjects.Image} */
	zona_12;
	/** @type {Neutral_Piece} */
	neutral_Piece_12;
	/** @type {Phaser.GameObjects.Container} */
	zone_12;
	/** @type {Phaser.GameObjects.Image} */
	zona_13;
	/** @type {Neutral_Piece} */
	neutral_Piece_13;
	/** @type {Phaser.GameObjects.Container} */
	zone_13;
	/** @type {Phaser.GameObjects.Image} */
	zona_14;
	/** @type {Neutral_Piece} */
	neutral_Piece_14;
	/** @type {Phaser.GameObjects.Container} */
	zone_14;
	/** @type {Phaser.GameObjects.Image} */
	zona_15;
	/** @type {Neutral_Piece} */
	neutral_Piece_15;
	/** @type {Phaser.GameObjects.Container} */
	zone_15;
	/** @type {Phaser.GameObjects.Image} */
	zona_16;
	/** @type {Neutral_Piece} */
	neutral_Piece_16;
	/** @type {Phaser.GameObjects.Container} */
	zone_16;
	/** @type {Phaser.GameObjects.Image} */
	zona_17;
	/** @type {Neutral_Piece} */
	neutral_Piece_17;
	/** @type {Phaser.GameObjects.Container} */
	zone_17;
	/** @type {Phaser.GameObjects.Image} */
	zona_18;
	/** @type {Neutral_Piece} */
	neutral_Piece_18;
	/** @type {Phaser.GameObjects.Container} */
	zone_18;
	/** @type {Phaser.GameObjects.Image} */
	zona_19;
	/** @type {Neutral_Piece} */
	neutral_Piece_19;
	/** @type {Phaser.GameObjects.Container} */
	zone_19;
	/** @type {Phaser.GameObjects.Image} */
	zona_20;
	/** @type {Neutral_Piece} */
	neutral_Piece_20;
	/** @type {Phaser.GameObjects.Container} */
	zone_20;
	/** @type {Phaser.GameObjects.Image} */
	zona_21;
	/** @type {Neutral_Piece} */
	neutral_Piece_21;
	/** @type {Phaser.GameObjects.Container} */
	zone_21;
	/** @type {Phaser.GameObjects.Image} */
	zona_22;
	/** @type {Neutral_Piece} */
	neutral_Piece_22;
	/** @type {Phaser.GameObjects.Container} */
	zone_22;
	/** @type {Phaser.GameObjects.Image} */
	zona_23;
	/** @type {Neutral_Piece} */
	neutral_Piece_23;
	/** @type {Phaser.GameObjects.Container} */
	zone_23;
	/** @type {Phaser.GameObjects.Image} */
	zona_24;
	/** @type {Neutral_Piece} */
	neutral_Piece_24;
	/** @type {Phaser.GameObjects.Container} */
	zone_24;
	/** @type {Phaser.GameObjects.Image} */
	zona_25;
	/** @type {Neutral_Piece} */
	neutral_Piece_25;
	/** @type {Phaser.GameObjects.Container} */
	zone_25;
	/** @type {Phaser.GameObjects.Image} */
	zona_26;
	/** @type {Neutral_Piece} */
	neutral_Piece_26;
	/** @type {Phaser.GameObjects.Container} */
	zone_26;
	/** @type {Phaser.GameObjects.Image} */
	zona_27;
	/** @type {Neutral_Piece} */
	neutral_Piece_27;
	/** @type {Phaser.GameObjects.Container} */
	zone_27;
	/** @type {Phaser.GameObjects.Image} */
	zona_28;
	/** @type {Neutral_Piece} */
	neutral_Piece_28;
	/** @type {Phaser.GameObjects.Container} */
	zone_28;
	/** @type {Phaser.GameObjects.Image} */
	zona_29;
	/** @type {Neutral_Piece} */
	neutral_Piece_29;
	/** @type {Phaser.GameObjects.Container} */
	zone_29;
	/** @type {Phaser.GameObjects.Image} */
	zona_30;
	/** @type {Neutral_Piece} */
	neutral_Piece_30;
	/** @type {Phaser.GameObjects.Container} */
	zone_30;
	/** @type {Phaser.GameObjects.Image} */
	zona_31;
	/** @type {Neutral_Piece} */
	neutral_Piece_31;
	/** @type {Phaser.GameObjects.Container} */
	zone_31;
	/** @type {Phaser.GameObjects.Image} */
	zona_32;
	/** @type {Demon_Piece} */
	demon_Piece;
	/** @type {Phaser.GameObjects.Container} */
	zone_32;
	/** @type {Phaser.GameObjects.Container} */
	zones;
	/** @type {Phaser.GameObjects.Image} */
	card01;
	/** @type {Phaser.GameObjects.Image} */
	card02;
	/** @type {Phaser.GameObjects.Image} */
	card03;
	/** @type {Phaser.GameObjects.Image} */
	card04;
	/** @type {Phaser.GameObjects.Container} */
	cards;
	/** @type {Phaser.GameObjects.Image} */
	window_1;
	/** @type {Phaser.GameObjects.Image} */
	plus;
	/** @type {Phaser.GameObjects.Image} */
	minus;
	/** @type {Phaser.GameObjects.Text} */
	text_2;
	/** @type {Phaser.GameObjects.Image} */
	close_Window;
	/** @type {Phaser.GameObjects.Container} */
	window;
	/** @type {Phaser.Input.Keyboard.Key} */
	enterKey;
	/** @type {Array<any>} */
	stars;

	/* START-USER-CODE */

	// Write more your code here

	create() {
    this.editorCreate();

		this.zona_1.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(1);
			})

			.on('pointerover', () => {
    			this.zona_1.setScale(1.05);
				if (selectedZone !== 1)
    				this.zona_1.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_1.setScale(1.0);
				if (selectedZone !== 1)
    				this.zona_1.clearTint();
			});

		this.zona_2.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(2);
			})

			.on('pointerover', () => {
    			this.zona_2.setScale(1.05);
				if (selectedZone !== 2)
    				this.zona_2.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_2.setScale(1.0);
				if (selectedZone != 2)
					this.zona_2.clearTint();
			});

		this.zona_3.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(3);
			})

			.on('pointerover', () => {
    			this.zona_3.setScale(1.05);
				if (selectedZone !== 3)
    				this.zona_3.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_3.setScale(1.0);
				if (selectedZone !== 3)
    				this.zona_3.clearTint();
			});

		this.zona_4.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(4);
			})

			.on('pointerover', () => {
    			this.zona_4.setScale(1.05);
				if (selectedZone !== 4)
    				this.zona_4.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_4.setScale(1.0);
				if (selectedZone !== 4)
    				this.zona_4.clearTint();
			});

		this.zona_5.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(5);
			})

			.on('pointerover', () => {
    			this.zona_5.setScale(1.05);
				if (selectedZone !== 5)
    				this.zona_5.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_5.setScale(1.0);
				if (selectedZone !== 5)
    				this.zona_5.clearTint();
			});

		this.zona_6.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(6);
			})

			.on('pointerover', () => {
    			this.zona_6.setScale(1.05);
				if (selectedZone !== 6)
    				this.zona_6.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_6.setScale(1.0);
				if (selectedZone !== 6)
    				this.zona_6.clearTint();
			});

		this.zona_7.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(7);
			})

			.on('pointerover', () => {
    			this.zona_7.setScale(1.05);
				if (selectedZone !== 7)
    				this.zona_7.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_7.setScale(1.0);
				if (selectedZone !== 7)
    				this.zona_7.clearTint();
			});

		this.zona_8.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(8);
			})

			.on('pointerover', () => {
    			this.zona_8.setScale(1.05);
				if (selectedZone !== 8)
    				this.zona_8.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_8.setScale(1.0);
				if (selectedZone !== 8)
    				this.zona_8.clearTint();
			});

		this.zona_9.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(9);
			})

			.on('pointerover', () => {
    			this.zona_9.setScale(1.05);
				if (selectedZone !== 9)
    				this.zona_9.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_9.setScale(1.0);
				if (selectedZone !== 9)
    				this.zona_9.clearTint();
			});

		this.zona_10.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(10);
			})

			.on('pointerover', () => {
    			this.zona_10.setScale(1.05);
				if (selectedZone !== 10)
    				this.zona_10.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_10.setScale(1.0);
				if (selectedZone !== 10)
    				this.zona_10.clearTint();
			});

		this.zona_11.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(11);
			})

			.on('pointerover', () => {
    			this.zona_11.setScale(1.05);
				if (selectedZone !== 11)
    				this.zona_11.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_11.setScale(1.0);
				if (selectedZone !== 11)
    				this.zona_11.clearTint();
			});

		this.zona_12.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(12);
			})

			.on('pointerover', () => {
    			this.zona_12.setScale(1.05);
				if (selectedZone !== 12)
    				this.zona_12.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_12.setScale(1.0);
				if (selectedZone !== 12)
    				this.zona_12.clearTint();
			});

		this.zona_13.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(13);
			})

			.on('pointerover', () => {
    			this.zona_13.setScale(1.05);
				if (selectedZone !== 13)
    				this.zona_13.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_13.setScale(1.0);
				if (selectedZone !== 13)
    				this.zona_13.clearTint();
			});

		this.zona_14.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(14);
			})

			.on('pointerover', () => {
    			this.zona_14.setScale(1.05);
				if (selectedZone !== 14)
    				this.zona_14.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_14.setScale(1.0);
				if (selectedZone !== 14)
    				this.zona_14.clearTint();
			});

		this.zona_15.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(15);
			})

			.on('pointerover', () => {
    			this.zona_15.setScale(1.05);
				if (selectedZone !== 15)
    				this.zona_15.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_15.setScale(1.0);
				if (selectedZone !== 15)
    				this.zona_15.clearTint();
			});

		this.zona_16.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(16);
			})

			.on('pointerover', () => {
    			this.zona_16.setScale(1.05);
				if (selectedZone !== 16)
    				this.zona_16.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_16.setScale(1.0);
				if (selectedZone !== 16)
    				this.zona_16.clearTint();
			});

		this.zona_17.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(17);
			})

			.on('pointerover', () => {
    			this.zona_17.setScale(1.05);
				if (selectedZone !== 17)
    				this.zona_17.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_17.setScale(1.0);
				if (selectedZone !== 17)
    				this.zona_17.clearTint();
			});

		this.zona_18.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(18);
			})

			.on('pointerover', () => {
    			this.zona_18.setScale(1.05);
				if (selectedZone !== 18)
    				this.zona_18.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_18.setScale(1.0);
				if (selectedZone !== 18)
    				this.zona_18.clearTint();
			});

		this.zona_19.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(19);
			})

			.on('pointerover', () => {
    			this.zona_19.setScale(1.05);
				if (selectedZone !== 19)
    				this.zona_19.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_19.setScale(1.0);
				if (selectedZone !== 19)
    				this.zona_19.clearTint();
			});

		this.zona_20.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(20);
			})

			.on('pointerover', () => {
    			this.zona_20.setScale(1.05);
				if (selectedZone !== 20)
    				this.zona_20.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_20.setScale(1.0);
				if (selectedZone !== 20)
    				this.zona_20.clearTint();
			});

		this.zona_21.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(21);
			})

			.on('pointerover', () => {
    			this.zona_21.setScale(1.05);
				if (selectedZone !== 21)
    				this.zona_21.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_21.setScale(1.0);
				if (selectedZone !== 21)
    				this.zona_21.clearTint();
			});

		this.zona_22.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(22);
			})

			.on('pointerover', () => {
    			this.zona_22.setScale(1.05);
				if (selectedZone !== 22)
    				this.zona_22.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_22.setScale(1.0);
				if (selectedZone !== 22)
    				this.zona_22.clearTint();
			});

		this.zona_23.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(23);
			})

			.on('pointerover', () => {
    			this.zona_23.setScale(1.05);
				if (selectedZone !== 23)
    				this.zona_23.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_23.setScale(1.0);
				if (selectedZone !== 23)
    				this.zona_23.clearTint();
			});

		this.zona_24.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(24);
			})

			.on('pointerover', () => {
    			this.zona_24.setScale(1.05);
				if (selectedZone !== 24)
    				this.zona_24.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_24.setScale(1.0);
				if (selectedZone !== 24)
    				this.zona_24.clearTint();
			});

		this.zona_25.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(25);
			})

			.on('pointerover', () => {
    			this.zona_25.setScale(1.05);
				if (selectedZone !== 25)
    				this.zona_25.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_25.setScale(1.0);
				if (selectedZone !== 25)
    				this.zona_25.clearTint();
			});

		this.zona_26.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(26);
			})

			.on('pointerover', () => {
    			this.zona_26.setScale(1.05);
				if (selectedZone !== 26)
    				this.zona_26.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_26.setScale(1.0);
				if (selectedZone !== 26)
    				this.zona_26.clearTint();
			});

		this.zona_27.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(27);
			})

			.on('pointerover', () => {
    			this.zona_27.setScale(1.05);
				if (selectedZone !== 27)
    				this.zona_27.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_27.setScale(1.0);
				if (selectedZone !== 27)
    				this.zona_27.clearTint();
			});

		this.zona_28.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(28);
			})

			.on('pointerover', () => {
    			this.zona_28.setScale(1.05);
				if (selectedZone !== 28)
    				this.zona_28.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_28.setScale(1.0);
				if (selectedZone !== 28)
    				this.zona_28.clearTint();
			});

		this.zona_29.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(29);
			})

			.on('pointerover', () => {
    			this.zona_29.setScale(1.05);
				if (selectedZone !== 29)
    				this.zona_29.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_29.setScale(1.0);
				if (selectedZone !== 29)
    				this.zona_29.clearTint();
			});

		this.zona_30.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(30);
			})

			.on('pointerover', () => {
    			this.zona_30.setScale(1.05);
				if (selectedZone !== 30)
    				this.zona_30.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_30.setScale(1.0);
				if (selectedZone !== 30)
    				this.zona_30.clearTint();
			});

		this.zona_31.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(31);
			})

			.on('pointerover', () => {
    			this.zona_31.setScale(1.05);
				if (selectedZone !== 31)
    				this.zona_31.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_31.setScale(1.0);
				if (selectedZone !== 31)
    				this.zona_31.clearTint();
			});

		this.zona_32.setInteractive()
			.on('pointerdown', () => {
    			this.ClickArea(32)
			})

			.on('pointerover', () => {
    			this.zona_32.setScale(1.05);
				if (selectedZone !== 32)
    				this.zona_32.setTint(0xbebebe);
			})
			.on('pointerout', () => {
    			this.zona_32.setScale(1.0);
				if (selectedZone !== 32)
    				this.zona_32.clearTint();
			});

		this.card01.setInteractive()
			.on('pointerdown', () => {
				console.log("First card selected");
			})
			.on('pointerover', () => {
        		this.card01.setScale(0.4);
    		})
    		.on('pointerout', () => {
        		this.card01.setScale(0.38);
    		});

		this.card02.setInteractive()
			.on('pointerdown', () => {
				console.log("Second card selected");
			})
			.on('pointerover', () => {
        		this.card02.setScale(0.4);
    		})
    		.on('pointerout', () => {
        		this.card02.setScale(0.38);
    		});

		this.card03.setInteractive()
			.on('pointerdown', () => {
				console.log("Third card selected");
			})
			.on('pointerover', () => {
        		this.card03.setScale(0.4);
    		})
    		.on('pointerout', () => {
        		this.card03.setScale(0.38);
    		});

		this.card04.setInteractive()
			.on('pointerdown', () => {
				console.log("Forth card selected");
			})
			.on('pointerover', () => {
        		this.card04.setScale(0.4);
    		})
    		.on('pointerout', () => {
        		this.card04.setScale(0.38);
    		});

		this.plus.setInteractive()
			.on('pointerdown', () => {
				console.log("Added troops");
			})
			.on('pointerover', () => {
        		this.plus.setScale(0.63);
    		})
    		.on('pointerout', () => {
        		this.plus.setScale(0.6);
    		});

		this.minus.setInteractive()
			.on('pointerdown', () => {
				console.log("Subtracted troops");
			})
			.on('pointerover', () => {
        		this.minus.setScale(0.63);
    		})
    		.on('pointerout', () => {
        		this.minus.setScale(0.6);
    		});

		this.pass_Turn.setInteractive()
			.on('pointerdown', () => {
				console.log("Pased the turn");
				this.endTurn()
			})
			.on('pointerover', () => {
        		this.pass_Turn.setScale(0.33);
    		})
    		.on('pointerout', () => {
        		this.pass_Turn.setScale(0.3);
    		});

		this.close_Window.setInteractive()
			.on('pointerdown', () => {
				console.log("Closed the window");
				this.window.visible = false 
			})
			.on('pointerover', () => {
        		this.close_Window.setScale(0.65);
    		})
    		.on('pointerout', () => {
        		this.close_Window.setScale(0.6);
    		});

		this.GameLoop();
			setInterval(() => {
				this.GameLoop()
			}, 3000);

		this.checkTurnOwnership();
			setInterval(() => {
				this.checkTurnOwnership()
			}, 3000);
	}

	GameLoop(){
		var request = new XMLHttpRequest();
		const scene = this

		request.onreadystatechange = () => {
			if (this.readyState == 4) {
				var data = JSON.parse(this.responseText);
				console.log(data)


				var player1ID = undefined
				var player2ID = undefined

				data.forEach(territory => {
					var zone = scene.zones.list[(territory.ter_id - 1)].list[1]
					var zoneText = zone.list[2]
					var zoneIcon = zone.list[1]
					var zoneBase = zone.list[0]
					zoneText.text = territory.troop_count
					if (territory.plr_own_id){
						zoneText.setColor("#ffffff")


						if (!player1ID){
							player1ID = territory.plr_own_id
							zoneIcon.setTexture("Angel Piece")
							zoneBase.setTexture("Number_Piece_Angel (1)")
						}else if (player1ID == territory.plr_own_id){
							zoneIcon.setTexture("Angel Piece")
							zoneBase.setTexture("Number_Piece_Angel (1)")
						}else {
							zoneIcon.setTexture("Demon Piece_1")
							zoneBase.setTexture("Number_Piece_Demon")
						}
					}
				});
			}
		};

		request.open("GET", "/game", true);
		request.send();
	}

 	ClickArea(area_number) {

		const scene = this

		if (!isMyTurn) {
			alert("It's not your turn!");
			return;
		}

		if (reinforceMode) {
			reinforceTerritory(area_number);
			return;
		}

		if (selectedZone === undefined) {
			selectedZone = area_number;
			const zone = scene.zones.list[(selectedZone) - 1].list[0]
			console.log(zone)
			if (zone) 
			{					
				zone.setTint(0x000000)
				console.log("Setting tint for zone " + selectedZone)
			}				
			this.verifyAdjacencies();
			return;
		}

		// Same zone selected, the zone is "forgotten"
			if (selectedZone === area_number) {
				const zone = scene.zones.list[(selectedZone) - 1].list[0]
				if (zone) 
					zone.clearTint()
				selectedZone = undefined;
				defendingZone = undefined;
				this.ClearAdjacents();
				return;
			}

		// If zone not "forgotten", thhen select next zone you wanna move/attack to
		if (selectedZone !== undefined && defendingZone === undefined) {
			defendingZone = area_number;

			// Verify if the zone is adjacent
			if (!highlightedAdjacents.includes(defendingZone)) {
				defendingZone = undefined;
				return;
			}

			const fromZone = scene.zones.list[(selectedZone) - 1].list[0];
			const toZone = scene.zones.list[(defendingZone) - 1].list[0];

			// Same owner then allow troop movement
			if (fromZone === toZone && fromZone !== "") {
				const move = prompt("How many troops do you want to move? (Leave at least 1 behind)"); //Eventually place the window here
				scene.window.visible = true

				const num = parseInt(move);
				if (isNaN(num) || num <= 0) {
					alert("Invalid number.");
				} else {
					const payload = {
						from_id: selectedZone,
						to_id: defendingZone,
						troops: num
					};

					const xhr = new XMLHttpRequest();
					xhr.open("POST", "/moveTroops", true);
					xhr.setRequestHeader("Content-Type", "application/json");
					xhr.onreadystatechange = () => {
						if (xhr.readyState === 4) {
							const response = JSON.parse(xhr.responseText);
							alert(response.message);
						}
					};
					xhr.send(JSON.stringify(payload));
				}

				// Reset selection
				fromZone.style.backgroundColor = "";
				toZone.style.backgroundColor = "";
				selectedZone = undefined;
				defendingZone = undefined;
				selectionDiv.innerHTML = "";
				ClearAdjacents();
				return;
			}

			// Different owner? Proceed to attack
			scene.window.visible = true
			// selectionDiv.innerHTML =
			// 	`Attacking from Area ${selectedZone} to Area ${defendingZone}<br>
			// 	Select number of attacking troops (max 3, must leave 1 behind):<br>
			// 	<select id="attackTroopCount">
			// 		<option value="1">1</option>
			// 		<option value="2">2</option>
			// 		<option value="3">3</option>
			// 	</select>
			// 	<button onclick='AttackZone()'>Attack</button>`;
			return;
		}

		// Third click (switching selected zone)
		if (selectedZone !== area_number && defendingZone !== undefined) {
			const oldAttacker = scene.zones.list[(selectedZone) - 1].list[0];
			const oldDefender = scene.zones.list[(defendingZone) - 1].list[0];
			if (oldAttacker) oldAttacker.style.backgroundColor = "";
			if (oldDefender) oldDefender.style.backgroundColor = "";

			selectedZone = area_number;
			defendingZone = undefined;
			const newZone = scene.zones.list[(selectedZone) - 1].list[0];
			// if (newZone) newZone.style.backgroundColor = "red";
			ClearAdjacents();
			verifyAdjacencies();
		}

		console.log("Clicked on area " + area_number);
	}

	verifyAdjacencies() {						//Check adjacencies between the territories via ter_id
		const dataToSend = {
			ter_ID: selectedZone
		};

		console.log("Selected zone:", selectedZone);

		const request = new XMLHttpRequest();

		request.onreadystatechange = () => {
			if (request.readyState === 4) {
				const data = JSON.parse(request.response);
				console.log(data)
				// Get the data from EVERY row instead of only the first.
				const adjacent = data.map(row => row.adj_ter2_id);
				console.log(data)
				console.log(adjacent)
				this.Coloradjacent(adjacent);
				// console.log("Adjacencies: " + adj_ter2_id);
			}
		};

		request.open("POST", "/verifyAdjecencies", true);
		request.setRequestHeader("Content-Type", "application/json");
		request.send(JSON.stringify(dataToSend));
	}

	Coloradjacent(arrayAdjacent) {         //Function to color the adjacent territories when clicking on an area
		highlightedAdjacents = arrayAdjacent;
		const scene = this

		arrayAdjacent.forEach(id => {
			if (id > 0) {
				const el = scene.zones.list[(id) - 1].list[0];
				el.setTint(0xf04b28)
			}
		});
	}

	ClearAdjacents() {                     //Function to clear selection of adjacent when clicking outside of areas.
		const scene = this

		highlightedAdjacents.forEach(id => {
			if (id > 0) {
				const el = scene.zones.list[(id) - 1].list[0];
				if (el) el.clearTint();
			}
		});
		highlightedAdjacents = [];
	}

	reinforceTerritory(area_number) {
		if (!isMyTurn) {
			alert("It's not your turn!");
			return;
		}

		const troopsToAdd = prompt("How many troops do you want to add?", "1");

		if (troopsToAdd === null) {
			reinforceMode = false;
			return;
		}

		const number = parseInt(troopsToAdd);

		if (isNaN(number) || number <= 0) {
			alert("Invalid number of troops.");
			return;
		}

		// Send reinforcement to the server
		const request = new XMLHttpRequest();
		request.open("POST", "/reinforce", true);
		request.setRequestHeader("Content-Type", "application/json");

		request.onreadystatechange = () => {
			if (this.readyState === 4) {
				const response = JSON.parse(this.responseText);
				alert(response.message);

				if (response.success) {
					alreadyReinforced = true;
					reinforceMode = false;
				}
			}
		};

		const dataToSend = {
			territory_id: area_number,
			troops: number
		};

		request.send(JSON.stringify(dataToSend));
	}

	AttackZone() {

		if (!isMyTurn) {
			alert("It's not your turn!");
			return;
		}

		if (!selectedZone || !defendingZone) return;
		const currentPlayerId = parseInt(sessionStorage.getItem("player_id"), 10);
		const troopCountInput = document.getElementById("attackTroopCount");
		const selectedTroopCount = parseInt(troopCountInput?.value || "1", 10);


		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				const data = JSON.parse(xhr.responseText);
				console.log("Attack logged:", data);

				if (!data.attackerRolls || !data.defenderRolls) {
					console.error("Dice rolls are undefined:", data);
					return;
				}

				const sortedAttackerRolls = data.attackerRolls.sort((a, b) => b - a);
				const sortedDefenderRolls = data.defenderRolls.sort((a, b) => b - a);

				const selectionDiv = document.getElementById("selection");
				if (selectionDiv) {
					selectionDiv.innerHTML = 
						`Attacking from Area ${selectedZone} to Area ${defendingZone}<br>
						<strong>Dice Roll Results:</strong><br>
						<strong>Attacker's roll:</strong> ${getDiceEmojis(sortedAttackerRolls)}<br>
						<strong>Defender's roll:</strong> ${getDiceEmojis(sortedDefenderRolls)}<br>`;
				}

				// ✅ If a territory was captured, give the player a card
				if (data.territoryCaptured === true) {
					giveCardToPlayer(currentPlayerId);
				}

			} else {
				console.error("Error logging attack:", xhr.statusText);
			}
		};

		xhr.onerror = () => {
			console.error("Request failed:", xhr.statusText);
		};

		const requestData = {
			ter_from_id: selectedZone,
			ter_to_id: defendingZone,
			att_troop_count: selectedTroopCount
		};

		alreadyReinforced = false;

		xhr.open("POST", "/logAttack", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(requestData));
	}

	giveCardToPlayer(player_id, game_id) {
		const xhrCard = new XMLHttpRequest();
		xhrCard.open("POST", "/giveCard", true);
		xhrCard.setRequestHeader("Content-Type", "application/json");

		xhrCard.onreadystatechange = () => {
			if (xhrCard.readyState === 4) {
				if (xhrCard.status === 200) {
					const response = JSON.parse(xhrCard.responseText);
					const card = response.card;

					console.log("🎴 Player received a card:", card);

					// ✅ Display card info in the game UI
					const cardRewardBox = document.getElementById("cardReward");
				if (cardRewardBox && card) {
				cardRewardBox.innerHTML = 
				`<strong>🎴 New Card:</strong><br>
				Type: <em>${card.eff_typ}</em><br>
				Value: <em>${card.eff_val}</em>`;
	}

				} else {
					console.error("Card request failed:", xhrCard.statusText);
				}
			}
		};

		xhrCard.send(JSON.stringify({ player_id, game_id }));
		checkHasCard();
	}

// Utilizing dice emojis intead of numbers ;)
	getDiceEmojis(rolls) {
		const diceEmojis = ["🎲", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
		return rolls.map(roll => diceEmojis[roll] || "❓").join(" ");
	}

	checkHasCard() {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "/hasCard", true);

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				const btn = document.getElementById("reinforceButton");
				if (xhr.status === 200) {
					const response = JSON.parse(xhr.responseText);
					btn.style.display = response.hasCard ? "block" : "none";
				} else {
					btn.style.display = "none";
				}
			}
		};

		xhr.send();
	}

	startReinforce() {
		if (!isMyTurn) {
			alert("❌ You can't use a card during the opponent's turn.");
			return;
		}

		const xhr = new XMLHttpRequest();


		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				const response = JSON.parse(xhr.responseText);
				if (response.success) {
					reinforceMode = true;
					alert("Card used! Select a territory to reinforce.");

					document.getElementById("reinforceButton").style.display = "none";

					const cardDisplay = document.getElementById("cardReward");
					if (cardDisplay) {
						cardDisplay.innerHTML = "";
					}
				} else {
					alert("No card available or already used.");
				}
			}
		};

		xhr.open("POST", "/useCard", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send();
	}


	endTurn() {
		const xhr = new XMLHttpRequest();
		const scene = this

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				console.log(xhr.responseText)
				if (xhr.status === 200) {
					scene.pass_Turn.visible = false
				} else {
					alert("Failed to end turn.");
					scene.pass_Turn.visible = false
				}
			}
		};

		xhr.open("POST", "/endTurn", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send();
	}

	checkTurnOwnership() {
		const xhr = new XMLHttpRequest();
		const scene = this

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				const data = JSON.parse(xhr.responseText)
				console.log(data)	
				scene.isMyTurn = data.isMyTurn;
				isMyTurn = data.isMyTurn;
			}
		};

		xhr.open("GET", "/isMyTurn", true);
		xhr.send();
	}

	checkVictoryStatus() {
		const xhr = new XMLHttpRequest();


		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					const response = JSON.parse(xhr.responseText);
					console.log(response)
					if (response.gameOver) {
						if (response.isWinner) {
							window.location.href = "/winner.html";
						} else {
							window.location.href = "/loser.html";
						}
					}
				}
			}
		};

		xhr.open("GET", "/checkVictory", true);
		xhr.send();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here