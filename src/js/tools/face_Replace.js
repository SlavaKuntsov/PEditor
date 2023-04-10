
import '../../../build/tracking-min.js';
import '../../../build/data/face-min.js';
import '../../../build/data/eye-min.js';
import '../../../build/data/mouth-min.js';
import app from '../app.js';
import config from '../config.js';
import Base_tools_class from '../core/base-tools.js';
import Base_layers_class from '../core/base-layers.js';
import alertify from 'alertifyjs/build/alertify.min';
import ImageFilters from '../libs/imagefilters.js';
import Helper_class from '../libs/helpers.js';

class face_Replace_class extends Base_tools_class {

	constructor(ctx) {
		super();
		this.Base_layers = new Base_layers_class();
		this.Helper = new Helper_class();
		this.ctx = ctx;
		this.name = 'face_Replace';
		this.tmpCanvas = null;
		this.tmpCanvasCtx = null;
		this.started = false;
	}

	load() {
		this.default_events();
	}

	default_dragMove(event) {
		if (config.TOOL.name != this.name)
			return;
		this.mousemove(event);

		//mouse cursor
		var mouse = this.get_mouse_info(event);
		var params = this.getParams();
		this.show_mouse_cursor(mouse.x, mouse.y, params.size, 'circle');
	}

	async mousedown(e) {
		this.started = false;
		var mouse = this.get_mouse_info(e);
		var params = this.getParams();
		if (mouse.click_valid == false) {
			return;
		}
		if (config.layer.type != 'image') {
			alertify.error('This layer must contain an image. Please convert it to raster to apply this tool.');
			return;
		}
		this.started = true;

		//get canvas from layer
		this.tmpCanvas = document.createElement('canvas');
		this.tmpCanvasCtx = this.tmpCanvas.getContext("2d");
		this.tmpCanvas.width = config.layer.width_original;
		this.tmpCanvas.height = config.layer.height_original;
		this.tmpCanvasCtx.drawImage(config.layer.link, 0, 0);
		await this.face_general('click', mouse);
		console.log('4');
		//register tmp canvas for faster redraw
		config.layer.link_canvas = this.tmpCanvas;
		config.need_render = true;
	}

	async face_general(type, mouse) {
		var ctx = this.tmpCanvasCtx;
		var tracker = new tracking.ObjectTracker(['face']);
        tracker.setStepSize(1.7);
		var img = new Image();
		document.getElementById("tmp").innerHTML = '';
		var a = document.createElement('input');
		a.setAttribute("id", "file_open");
		a.type = 'file';
		document.getElementById("tmp").appendChild(a);
		var FR = new FileReader();
		document.getElementById('file_open').addEventListener('change', function (e) {
			var files = e.target.files;
			FR.readAsDataURL(files[0]);
		});
		FR.onload = function () {
		img.src=FR.result
		img.decode().then(()=>{
		console.log('1');
		console.log(img);
        tracking.track(config.layer.link, tracker);
        tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
			console.log('2');
          window.plot(rect.x, rect.y, rect.width, rect.height);
         });
        });
        window.plot = function(x, y, w, h) {
			console.log('3');
				ctx.drawImage(img, x,y,w,h);
			};
		});
	}
		document.querySelector('#file_open').click();
	}
	
	mousemove(e) {
	}

	async mouseup(e) {
		const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
		await wait(8000);
		if (this.started == false) {
			return;
		}
		delete config.layer.link_canvas;

		app.State.do_action(
			new app.Actions.Bundle_action('face_Replace_tool', 'face_Replace Tool', [
				new app.Actions.Update_layer_image_action(this.tmpCanvas)
			])
		);

		//decrease memory
		this.tmpCanvas.width = 1;
		this.tmpCanvas.height = 1;
		this.tmpCanvas = null;
		this.tmpCanvasCtx = null;
	}
}
export default face_Replace_class;
