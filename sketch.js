let fft, mediaElement, amplitude;

let canPlay = false;
let playing = false;

const colors = [];

const MAGIC = {
	TIGHTNESS: 1.0,
	CIRCLE: {
		DELTA: 50,
		DENSITY: 0.2,
		STROKE: 2,
	},
};

let flyingThings = [];

function getCanvasDimensions() {
	const n = max(windowWidth, windowHeight);

	return [n, n];
}

const RADIO = {
	STUDENT: 'http://161.53.122.184:8000/AAC128.aac',
	EXTRA: 'http://streams.extrafm.hr:8110/;',
};

function setup() {
	createCanvas(...getCanvasDimensions());
	noFill();
	angleMode(DEGREES);

	// mimics the autoplay policy
	getAudioContext().suspend();

	mediaElement = createAudio(RADIO.STUDENT, () => {
		canPlay = true;
	});

	amplitude = new p5.Amplitude();

	fft = new p5.FFT();
	fft.setInput();
}

function draw() {
	background(0);
	translate(width / 2, height / 2);

	if (playing) {
		fft.analyze();

		const wave = fft.waveform();

		const bass = fft.getEnergy('bass');
		const treble = fft.getEnergy('treble');
		const mid = fft.getEnergy('mid');

		const mapMid = map(mid, 0, 255, -100, 200);

		const mapTreble = map(treble, 0, 255, 200, 350);

		const mapbass = map(bass, 0, 255, 50, 200);

		const numberOfThings = map(amplitude.getLevel(), 0, 1, 1, 20);

		for (i = 0; i < numberOfThings; i += 0.1) {
			rotate(360 / (numberOfThings / 2));

			noFill();

			push();
			stroke('#FAC8CD');
			rotate(frameCount * 0.002);
			strokeWeight(1);
			polygon(mapbass + i, mapbass - i, 5 * i, 5);
			pop();

			push();
			stroke('#D7BCC8');
			strokeWeight(0.5);
			polygon(mapMid + i / 2, mapMid - i * 2, 5 * i, 7);
			pop();

			push();
			stroke('#629677');
			strokeWeight(2);
			polygon(mapTreble + i / 2, mapTreble - i / 2, (5 * i) / 2, 3);
			pop();
		}

		for (let i = 0; i < numberOfThings; i++) {
			flyingThings.push(new FlyingThing());
		}

		for (let i = flyingThings.length - 1; i >= 0; i--) {
			const thing = flyingThings[i];

			if (thing.isVisible()) {
				thing.move(bass > 240);
				thing.paint();
			} else {
				flyingThings.splice(i, 1);
			}
		}

		noFill();
		curveTightness(MAGIC.TIGHTNESS);
		stroke('#98B6B1');
		strokeWeight(MAGIC.CIRCLE.STROKE);

		beginShape();

		// change desnity depending on the volume?
		for (i = 0; i <= 360; i += MAGIC.CIRCLE.DENSITY) {
			let index = floor(map(i !== 360 ? i : 0, 0, 360, 0, wave.length - 1));

			const r = map(
				wave[index],
				-1,
				1,
				min(windowHeight, windowWidth) / 2 - MAGIC.CIRCLE.DELTA,
				min(windowHeight, windowWidth) / 2,
			);

			const x = r * sin(i);
			const y = r * cos(i);

			curveVertex(x, y);
		}

		endShape(CLOSE);
	}

	if (!canPlay) {
		fill(255);
		text('Loading', 0, 0);
	} else if (canPlay && !playing) {
		noFill();
		stroke(255);
		triangle(-20, 20, 20, 0, -20, -20);
	}
}

function mousePressed() {
	userStartAudio();
}

function togglePlay() {
	if (canPlay && !playing) {
		mediaElement.play();
		playing = true;
		mediaElement.connect();
	} else if (playing) {
		mediaElement.pause();
		playing = false;
	}
}

function mouseClicked() {
	togglePlay();
}

function keyPressed() {
	if (keyCode === 32) {
		togglePlay();
	}
}

function windowResized() {
	flyingThings = [];
	resizeCanvas(...getCanvasDimensions());
}

class FlyingThing {
	constructor() {
		this.position = p5.Vector.random2D().mult(
			min(windowHeight, windowWidth) / 5 - MAGIC.CIRCLE.DELTA,
		);
		this.velocity = createVector(0, 0);
		this.acceleration = this.position.copy().mult(0.00005);
	}

	isVisible() {
		const { x, y } = this.position;

		return -width / 2 < x || x < width / 2 || -height / 2 < y || y < height / 2;
	}

	move(enchance) {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity.mult(enchance ? 2 : 1));
	}

	paint() {
		stroke('#98B6B1');
		strokeWeight(0.5);
		fill(0);

		polygon(this.position.x, this.position.y, 4, 3);
	}
}

function polygon(x, y, radius, points) {
	const angle = 360 / points;

	beginShape();

	for (let a = 0; a < 360; a += angle) {
		const sx = x + cos(a) * radius;
		const sy = y + sin(a) * radius;

		vertex(sx, sy);
	}

	endShape(CLOSE);
}
