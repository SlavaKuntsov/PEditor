
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

class face_Blur_class extends Base_tools_class {

	constructor(ctx) {
		super();
		this.Base_layers = new Base_layers_class();
		this.Helper = new Helper_class();
		this.ctx = ctx;
		this.name = 'face_Blur';
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

	mousedown(e) {
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
		this.face_general('click', mouse);
		//register tmp canvas for faster redraw
		config.layer.link_canvas = this.tmpCanvas;
		config.need_render = true;
	}

	face_general(type, mouse) {
		var ctx = this.tmpCanvasCtx;
		var tracker = new tracking.ObjectTracker(['face']);
        var Helper= this.Helper;
        var adaptSize = this.adaptSize;
        tracker.setStepSize(1.7);
        tracking.track(config.layer.link, tracker);
        tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
          window.plot(rect.x, rect.y, rect.width, rect.height);
         });
        });
        window.plot = function(x, y, w, h) {
				ctx.rect(x,y,w,h);
				ctx.stroke();
                /*var mouse_x = Math.round(x+w/2) - config.layer.x;
                var mouse_y = Math.round(y+h/2) - config.layer.y;
                mouse_x = adaptSize(mouse_x, 'width');
		        mouse_y = adaptSize(mouse_y, 'height');
		        var size_w = adaptSize(w, 'width');
		        var size_h = adaptSize(h, 'height');             
		        //find center
		        var center_x = mouse_x - Math.round(size_w / 2);
		        var center_y = mouse_y - Math.round(size_h / 2);
		        //convert float coords to integers
		        center_x = Math.round(center_x);
		        center_y = Math.round(center_y);
		        mouse_x = Math.round(mouse_x);
		        mouse_y = Math.round(mouse_y);
                var imageData = ctx.getImageData(center_x, center_y, size_w, size_h);
                var filtered = ImageFilters.StackBlur(imageData, 15); //add effect
                Helper.image_round(ctx,mouse_x, mouse_y, size_w, size_h, filtered);*/
			};
		}
	mousemove(e) {
	}

	mouseup(e) {
		if (this.started == false) {
			return;
		}
		delete config.layer.link_canvas;

		app.State.do_action(
			new app.Actions.Bundle_action('face_Blur_tool', 'face_Blur Tool', [
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
export default face_Blur_class;
