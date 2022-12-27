'use strict';
//const math = require('mathjs');
let model_id = "";
let classes;
const info_studies = "Below follows three studies, the two first focuses on what we denote as part of the target domain.\
These images are from an unseen part of the training data but re-scaled, re-positioned (Study 1) and multiplied (Study 2). \
Study 3 exposes the trained network to o.o.d exemplars in that the shapes are not taken directly from the training data, \
instead they are created using a graphics program. We hypothesise that a human end user would label all shapes in Study 1, \
Study 2 and the first four images in Study 3 as part of the target domain and also agree on their classification. In the \
text below we take a human perspective when commenting the classification and we do not try to get any deep understanding on \
why the network miss-classifies or what training data that needs to be added to improve classification. The experimental \
focus is instead on generalisation and the discrepancy between how neural networks generalise compared to how humans generalise. <br/>\
Code for studies can be found at <a href='shapes_XAI_evaluate.ipynb'>shapes_XAI_evaluate.ipynb</a>"
const title_study_1 = "<b>Study 1</b>: Generalisation towards singular resized and re-positioned exemplars from the target domain"
const title_study_2 = "<b>Study 2:</b> Generalisation towards multiple resized and re-positioned exemplars from the target domain"
const title_study_3 = "<b>Study 3:</b> Generalisation towards o.o.d. exemplars"
const info_study_1 = "<i>Needs justification to the actual model's behavoiur.</i> Generalisation towards singular resized and re-positioned exemplars from the target domain\
This setting is our baseline, a setting where the neural network, as expected, classifies all shapes with high class probability. \
The first four shapes are from a test set without any data shift compared to the training set. \
For the four last shapes data drift is introduced by resizing and re - positioning shapes slightly outside the distribution in the training data\
<ul>\
  <li>Class probability: All shapes are correctly classified with high class probability. </li>\
  <li>XAI focus: For the star and the triangle the shape is in focus.For the circle and the square the focus is on the background\
   surrounding the shape and not the shape. </li>\
</ul>\
<i> Summary: </i> We find that the knowledge learned by the model is not consequent since the XAI methods indicate that for two \
of the shapes(circle and square) the inverse shape(background) is used to classify and for star and triangle the actual \
shape delimited by a contour is used.The study is aligned with our expectations visa-vi class probability but not visa-vi \
internal knowledge representation used for the classification."
const info_study_2 = " <i>Needs justification to the actual model's behavoiur.</i> Generalisation towards multiple resized and re-positioned exemplars from the target domain.\
This setting introduces data shift in the form of multiple exemplars from the test set (resized and re-positioned) in each image.\
<ul>\
    <li>Class probability: In images where a star is present the class probability is close to 100%. \
    In line with this it is surprising that Image 7, dominated by a triangle, is classified as a star with probability 100%.\
    Only Image 3 with four circles is classified in a fashion that agrees with human intuition.</li>\
    <li> XAI focus: For the images that are predicted with the label star the XAI methods (most clearly Occlusion)\
    indicate this shape in the image. For the images picturing all shapes (Image 1 and Image 2) star dominates the markings \
    followed by triangle and square but the methods do not point out circle at all. The domination of the star is puzzling in Image 5 \
    where it is predicted with 100% class probability even if that specific shape is not in the image. Both XAI methods indicates for Image \
    5 that the the latent spaces representing a triangle is the shape that contributes most to the erroneous prediction. All XAI methods are \
    vague or hard to interpret for some of the images. Especially Image 3,7 and 8 are inexact.</li>\
</ul>\
<i> Summary: </i> We find that the trained model fails to predict correctly and additionally the class probabilities \
are misaligned with human intuition. The class predictions and the XAI methods indicate that star dominate, if it is present. \
This is contrary to human intuition in which the number of shapes does not constitute a demarcation for the target domain. \
Our expectation for the study were that the neural network should classify the image with an class probability that in some \
sense correlates to the mix of shapes in an image (all shapes of similar size in one image should then result in around 25% \
class probability for each shape). The XAI methods should, for the classification promoted, reflect this by highlighting the \
corresponding shape."
const info_study_3 =" <i>Needs justification to the actual model's behavoiur.</i> In this study, we further introduce data shift to explore generalisation by using shapes not part of the training\
 data and evaluate if the network generalise towards these, from the networks perspective, o.o.d exemplars. The shapes are produced \
 using a standard graphics program and have sharper edges which are different from the slightly rugged edges in the training data. \
 We additionally introduce colours and alternative shapes as extra data shift to get further intuition of how the network generalise.\
<ul>\
    <li>Class probability: Image 3 and Image 5 are not correctly classified especially if the high class probability is taken into account.\
     Image 6 is logically classified as a square with low class probability, the alternative classification is triangle 42%. \
     Image 8, which pictures an arrow, is classified as a triangle which bears some logic, but, the high class probability is questionable \
     and indicates the inability of a neural network to identify a shape as o.o.d. </li>\
    <li>XAI focus: The methods indicate, in line with Study 1 and Study 2, that the neural network for triangle and stars consider relevant\
     areas in the images. Even if the classification in Image 1,2 and 6 can be considered as correct the XAI methods shows that internal \
     knowledge representation in the images highlights irrelevant areas. Image 3 (star) and Image 5 (ellipse) are erroneously classified \
      with high class probability and the neural network focuses on irrelevant areas in the image. For Image 8 (arrow) the XAI methods\
       indicate that the triangle part of the arrow seems to be used to classify.</li>\
</ul>\
<i> Summary: </i>Image 3 (star), Image 5 (ellipse) and Image 8 (arrow) are erroneously predicted with high class probability. \
This points to the inability for the network to identify o.o.d exemplars and, more problematic, that high class probability is a \
insufficient metric to indicate this. It is also hard for a human to understand how the network generalise, why for example (Image 3), \
an unfilled star, is not classified correctly when a coloured square is correctly classified. Our expectations are similar to Study 2: \
that the class probability should reflect the shapes in the images and the XAI methods should then mark relevant areas in relation to \
the prediction. Additionally, we expect the predictions to be, from a human aspect, logical and predict a rectangle as a square, perhaps \
with lower class probability. The predictions related to Image 5 and Image 6 contradicts that the network generalise in line with this \
expectation."
//
//const version = "version07";
//const models = ["ResNet101","ResNet152","GoogLeNet","Inception_V3","efficientnet_v2_s"]; //remove
//const lowest_mean_class_probability = 16; //Remove
//const number_of_probabilities_to_show = 10;  //Remove
//let classes =[];
//let probs =[]

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

Object.defineProperty(String.prototype, 'capitalise', {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

class Probabilities {
  constructor(label, probability) {
    this.label = label;
    probability = (Math.round((probability + Number.EPSILON) * 100) / 100)*100;
    this.probability = probability.toFixed(1);
  }
}
let studies = []
class Study {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    let i = 0;
    Object.entries(this.value).forEach(([key]) => {
      if (Number.isInteger(parseInt(key))) {
        i++;
      }
    });
    this.number_images_in_study = i;

  }
  get_number_images_in_study() {
    return this.number_images_in_study;
  }

  get_datetime() {
    if (this.value.hasOwnProperty("datetime")) {
      return this.value["datetime"];
    } else {
      return null;
    }
  }
  get_title() {
    let title = "Title"
    if (this.key==="study1"){
      title = title_study_1;
    }else if(this.key==="study2"){
      title = title_study_2;
    }else if(this.key==="study3"){
      title = title_study_3;
    }
    return title;
    
/*     if (this.value.hasOwnProperty("title")) {
      return this.value["title"].capitalise();
    } else {
      return null;
    } */
  }
  get_description() {
    let description = "Description"
    if (this.key==="study1"){
      description = info_study_1;
    } else if(this.key==="study2"){
      description = info_study_2;
    }else if(this.key==="study3"){
      description = info_study_3;
    }
    return description;
   /*  if (this.value.hasOwnProperty("description")) {
      return this.value["description"];
    } else {
      return null;
    } */
  }
  get_gradcam_image(i) {
    if (i < this.number_images_in_study) {
      return this.value[i]["gradcam"]["image_path"];
    } else {
      return null;
    }
  }
  get_transformed_image(i) {
    if (i < this.number_images_in_study) {
      return this.value[i]["transformed"]["image_path"];
    } else {
      return null;
    }
  }
  get_occlusion_image(i) {
    if (i < this.number_images_in_study) {
      return this.value[i]["occlusion"]["image_path"];
    } else {
      return null;
    }
  }

  get_probabilities_for_image(i) {
    let probabilities = []
    if (i < this.number_images_in_study) {
      Object.entries(this.value[i]).forEach(([key, value]) => {
        if (Number.isInteger(parseInt(key))) {
          probabilities[key] = new Probabilities(this.value[i][key]["label"], this.value[i][key]["probability"])
        }
      });
      return probabilities;
    } else {
      return null;
    }
  }

}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}
// Page is loaded! Now event can be wired-up
function onDocumentReady() {
  console.log('Document ready.');
  populate();
}
async function populate() {
  if (params.id != null) {
    model_id = params.id;
  }
  let requestURL = 'models/models.json';
  let request = new Request(requestURL);
  let response = await fetch(request);
  const models = await response.json();
  requestURL = 'classes.txt';
  request = new Request(requestURL);
  response = await fetch(request);
  classes = await response.text();
  classes = classes.split('\r\n');
  set_globals(models[model_id]);

  //move


  //set_header_images(structure);
  //set_predictions();
  //compare_models();
  //populate_structure(structure);
  //add_models_to_section( );
}
//Helpers
function idx_to_label(index) {
  return classes[index];
}
function label_to_idx(label) {
  return classes.findIndex(x => x === label);
}

function set_globals(model) {
  var p = document.getElementById('model_info');
  p.classList.addclass = "text-left"
  let weights = "None"
  //console.log(model)
  if ((model.weights).split(".").length > 1) {
    weights = (model.weights).split(".")[1]
  }
  const pretrained = (weights === "None" ? 'The model is initialised with random weights.' :
    'The model is pretrained on ImageNet using the weights ' + weights + '.');
  const transformation = (model.transformation === "transforms.Resize(size=(299, 299))") ?
    "Transformation used can be found in <a href='shapes_train.ipynb'>shapes_train.ipynb</a>" :
    "Used transformation in <a href='shapes_train.ipynb'>shapes_train.ipynb</a> and the ImageNet's recommended transformations"

  p.innerHTML = `The ImageNet model: <a href="https://pytorch.org/vision/stable/models.html#classification"> ${model.model_name}</a> trained  on the 
  a basic shapes <a href="https://www.kaggle.com/datasets/smeschke/four-shapes">dataset</a> 
  (circle, square, star, triangle). 16 000 images are used for training in a 90/10 split. 
  ${pretrained}  
  ${transformation}, the model is trained over ${model.num_epocs} epocs. Test accuracy: ${model.training["test_" + (model.num_epocs - 1)].epoch_acc}
  and test loss: ${model.training["test_" + (model.num_epocs - 1)].test_loss}.<br> Training performed ${model.time}.`;
  if ((model["studies"]) != null) {
    Object.entries(model["studies"]).forEach(([key, value]) => {
      studies.push(new Study(key, value))

    });
    set_saliency_maps(studies);
  } else {
    const e2 = document.getElementById("container");
    add_message_section(e2, "No test data exists", "This models has not been evaluated towards a test set and no saliency maps or test data \
    has therefor been produced");
  }
}

function add_message_section(e, title, information) {
  const e1 = document.createElement('section');
  let row_info = document.createElement('div');
  row_info.classList.add("row", "flex-nowrap", "g-0");
  const header_column = document.createElement('div');
  header_column.classList.add("col-0");
  const _header = document.createElement('h3');
  _header.innerHTML = title;
  const _p = document.createElement('p');
  _p.innerHTML = information;
  header_column.appendChild(_header);
  header_column.appendChild(_p);
  row_info.appendChild(header_column);
  e1.appendChild(row_info)
  e.append(e1)
}

function set_saliency_maps(studies) {
  const e = document.getElementById("saliency_maps");
  add_message_section(e, "Studies", info_studies)
  let row_info = document.createElement('div');
  row_info.classList.add("row", "flex-nowrap", "g-0");
  e.appendChild(row_info)
  studies.forEach((study) => {
    add_study(study)
  });
  //} 

}

function add_study(study) {
  const e = document.getElementById("saliency_maps");
  const e1 = document.createElement('section');
  let row_info = document.createElement('div');
  row_info.classList.add("row", "flex-nowrap", "g-0");
  const header_column = document.createElement('div');
  header_column.classList.add("col-0");
  const _header = document.createElement('h5');
  _header.innerHTML = study.get_title().capitalise();
  //const _p = document.createElement('p');
  //_p.innerHTML = study.get_description()+"<br/>"+"<i>Created: </li>"+ study.get_datetime().capitalise();
  header_column.appendChild(_header);
  //header_column.appendChild(_p);
  row_info.appendChild(header_column);
  e1.append(row_info)

  /* console.log(study)
  console.log(study.get_datetime())
  console.log(study.get_gradcam_image(2))
  console.log(study.get_number_images_in_study())
  console.log(study.get_probabilities_for_image(0)) */
  let images_grad, caps_grad;
  let images_occ, caps_occ;
  let images_trans, caps_trans;
  let column = [], row = [];
  for (let i = 0; i < study.get_number_images_in_study(); i++) {
    //study.forEach((model, i) => {
    column = i % 4;
    row = Math.trunc((i / 4));
    if (column == 0) {
      row_info = create_image_row()
      images_trans = row_info[1];
      caps_trans = row_info[2];
      const hr = document.createElement('hr')
      hr.classList.add("border", "border-2", "opacity-75");
      e1.appendChild(hr)
      e1.appendChild(row_info[0]);
    }
    images_trans[column].src = study.get_transformed_image(i);
    caps_trans[column].innerHTML = get_class_probabilities(study, i)

    if (column == 0) {
      row_info = create_image_row()
      images_grad = row_info[1];
      caps_grad = row_info[2];
      e1.appendChild(row_info[0]);
    }
    images_grad[column].src = study.get_gradcam_image(i);
    caps_grad[column].innerHTML = "<b>Saliency map</b>: GradCam"
    //row2
    if (column == 0) {

      //<hr class="border border-danger border-2 opacity-50"></hr>
      row_info = create_image_row()
      images_occ = row_info[1];
      caps_occ = row_info[2];

      e1.appendChild(row_info[0]);

    }
    images_occ[column].src = study.get_occlusion_image(i);
    caps_occ[column].innerHTML = "<b>Saliency map</b>: Occlusion"
  }

  e.append(e1)
  /* links[column].href = "model.html?id="+model.name;
  let weights = "None"
  if ((model.values.weights).split(".").length > 0){
    weights = (model.values.weights).split(".")[1]
  }
  caps[column].innerHTML = `<i>Model: </i>${model.values.model_name} 
  <br/><i>Transforms used:</i> ${model.values.transformation}
  <br/> <i>Weights used:</i> ${weights}
  <br/> <i>Number epocs: </i> ${model.values.num_epocs}
  <br/> <i>Accuracy:</i> ${model.values.training["test_" + (model.values.num_epocs - 1)].epoch_acc}
  <br/> <i>Loss::</i> ${model.values.training["test_" + (model.values.num_epocs - 1)].test_loss}
  <br/> <i>Datetime for training:</i> ${model.values.time}`; */
}

function create_image_row() {
  let images = [];
  let caps = [];
  let row_maps = document.createElement('div');
  row_maps.classList.add("row", "flex-nowrap", "g-0");
  for (let j = 0; j < 4; j++) {
    let column_maps = document.createElement('div');
    column_maps.classList.add("col-3", "col-pixel-width-100");
    let img = document.createElement("img");
    img.classList.add("img-thumbnail");
    img.src = "images/placeholder.png"
    images.push(img);
    let cap = document.createElement("figcaption");
    cap.textContent = "---"
    cap.classList.add("text-left", "small")
    caps.push(cap);
    let fig = document.createElement("figure");
    fig.appendChild(img);
    fig.appendChild(cap);
    column_maps.appendChild(fig);
    row_maps.appendChild(column_maps);
  };
  return [row_maps, images, caps];
}

function get_class_probabilities(study, image_nbr) {
  const probabilties = study.get_probabilities_for_image(image_nbr);
  let caption = "<b>Image " +image_nbr+"</b><br/>\
  <b>Label: Class probability</b><br/>";
  probabilties.forEach(element => {
    caption += (element.label).capitalise() +
      ": " + (element.probability) + "%<br/>";
  });
  return caption
}
/////////////////////OLD BELOW////////////////////////
/* const Prob = function (probability, classnumber, label) {
  this.probability = probability;
  this.classnumber = classnumber;
  this.label = label;
}

let mean_and_dispersion;
class Mean_and_Dispersion {
  constructor(image, value) {
    this.image = image;
    this.value = value;
  }
  get_mean_values(classnumber) {
    if (this.value.hasOwnProperty("mean_average_csv_for_candidate_" + classnumber)) {
      let result = []
      let itBe = (this.value["mean_average_csv_for_candidate_" + classnumber]).split(',');
      for (let i = 0; i < itBe.length; i++) {
        result.push(itBe[i])
      }
      return result;
    } else {
      return "";
    }

  }
  get_std_values(classnumber) {
    if (this.value.hasOwnProperty("std_average_csv_for_candidate_" + classnumber)) {
      let result = []
      let itBe = (this.value["std_average_csv_for_candidate_" + classnumber]).split(',');
      for (let i = 0; i < itBe.length; i++) {
        result.push(itBe[i])
      }
      return result;
    } else {
      return "";
    }
  }
  get_mean_saliency_map_path(classnumber) {
    if (this.value.hasOwnProperty("mean_image_path_candidate_" + classnumber)) {
      return "../" + this.value["mean_image_path_candidate_" + classnumber];
    } else {
      return "";
    }
  }
  get_dispersion_saliency_map_path(classnumber) {
    if (this.value.hasOwnProperty("diff_image_path_candidate_" + classnumber)) {
      return "../" + this.value["diff_image_path_candidate_" + classnumber];
    } else {
      return "";
    }
  }
}

let probs_v1 = []
class Prob_v1 {
  constructor(classnumber, label) {
    this.classnumber = classnumber;
    this.label = label;
    this.probs = [];
    this.maxProbability = 0;
  }
  get_average_prob() {
    var average = 0;
    this.probs.forEach((item, index, array) => {
      average = average + item;
    });
    return average / this.probs.length;
  }
  get_number_prob() {
    return this.probs.length;
  }
}

let models_v1 = []
class Model_v1 {
  constructor(name, values) {
    this.name = name
    this.values = values;
  }
  get_saliency_map_for_class(classnumber) {
    let path = "";
    Object.entries(this.values.xai).forEach(([key, value]) => {
      if (Number.isInteger(parseInt(key))) {
        //let path_label = value.substring(value.lastIndexOf("/")+1).split(".")[0].replace("_"," ");
        let path_label = value.substring(value.lastIndexOf("/") + 1).split(".")[0];
        if (parseInt(path_label) === classnumber) {
          path = value;
        }
      }
    });
    return path;
  }

  get_model_name(id) {
    let name = "Kalle";
    Object.entries(this.values).forEach(([key, value]) => {
      console.log(key);
      name = value;
    });
    return this.name;
  }
  get_class_prob_for_label(classnumber) {
    let probability = 0;
    Object.entries(this.values).forEach(([key, value]) => {
      if (Number.isInteger(parseInt(key))) {
        if (classnumber === value.labelid) {
          probability = value.probability;
        }
      }
    });
    return probability;
  }
  get_saliency_values(classnumber) {
    let mean_values = []
    Object.entries(this.values.xai).forEach(([key, value]) => {
      if (value.hasOwnProperty("target_idx")) {
        if (parseInt(value.target_idx) === classnumber) {
          let mean_string_values = (value.mean_values).split(",");
          for (var j = 0; j < mean_string_values.length; ++j) {
            mean_values.push(mean_string_values[j]);
          }
        }
      }
    });
    return mean_values;
  }
  get_raw_values(classnumber) {
    let raw_values = []
    Object.entries(this.values.xai).forEach(([key, value]) => {
      if (value.hasOwnProperty("target_idx")) {
        if (parseInt(value.target_idx) === classnumber) {
          raw_values = csv_to_list(value.raw_string)
        }
      }
    });
    return raw_values;
  }

  get_mean_raw_value(classnumber) {
    let mean_value = 0;
    Object.entries(this.values.xai).forEach(([key, value]) => {
      if (value.hasOwnProperty("target_idx")) {
        if (parseInt(value.target_idx) === classnumber) {
          mean_value = math.mean(csv_to_list(value.raw_string));
        }
      }
    });
    return mean_value;
  }

  get_mean_from_pos_value(classnumber) {
    let mean_value = 0;
    Object.entries(this.values.xai).forEach(([key, value]) => {
      if (value.hasOwnProperty("target_idx")) {
        if (parseInt(value.target_idx) === classnumber) {
          mean_value = math.mean(remove_neg_from_list(csv_to_list(value.raw_string)));
        }
      }
    });
    return mean_value;
  }

  get_mean_from_neg_value(classnumber) {
    let mean_value = 0;
    Object.entries(this.values.xai).forEach(([key, value]) => {
      if (value.hasOwnProperty("target_idx")) {
        if (parseInt(value.target_idx) === classnumber) {
          mean_value = math.mean(remove_pos_from_list(csv_to_list(value.raw_string)));
        }
      }
    });
    return mean_value;
  }

  get_std_from_pos_value(classnumber) {
    let std_value = 0;
    Object.entries(this.values.xai).forEach(([key, value]) => {
      if (value.hasOwnProperty("target_idx")) {
        if (parseInt(value.target_idx) === classnumber) {
          std_value = math.std(remove_neg_from_list(csv_to_list(value.raw_string)));
        }
      }
    });
    return std_value;
  }
  get_std_from_neg_value(classnumber) {
    let std_value = 0;
    Object.entries(this.values.xai).forEach(([key, value]) => {
      if (value.hasOwnProperty("target_idx")) {
        if (parseInt(value.target_idx) === classnumber) {
          std_value = math.std(remove_pos_from_list(csv_to_list(value.raw_string)));
        }
      }
    });
    return std_value;
  }

  get_std_raw_value(classnumber) {
    let std_value = 0;
    Object.entries(this.values.xai).forEach(([key, value]) => {
      if (value.hasOwnProperty("target_idx")) {
        if (parseInt(value.target_idx) === classnumber) {
          std_value = math.std(csv_to_list(value.raw_string));
        }
      }
    });
    return std_value;
  }
}

function idx_to_label(index) {
  return classes[index];
}
function label_to_idx(label) {
  return classes.findIndex(x => x === label);
}

function csv_to_list(csv_string) {
  let result = [];
  let itBe = (csv_string).split(',');
  for (let i = 0; i < itBe.length; i++) {
    result.push(itBe[i])
  }
  return result;
}

function remove_neg_from_list(list) {
  let result = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i] > 0) {
      result.push(list[i])
    }
  }
  return result;
}

function remove_pos_from_list(list) {
  let result = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i] < 0) {
      result.push(list[i])
    }
  }
  return result;
}


function set_header_images(structure) {
  var e = document.getElementById('org_image');
  var img = document.createElement("img");
  img.src = "../" + structure[study_nbr]["image_path"];
  var cap = document.createElement("figcaption");
  cap.textContent = "Width:" + img.width + " Height:" + img.height
  cap.classList.add("text-center")
  img.classList.add("img-thumbnail");
  var fig = document.createElement("figure");
  fig.appendChild(img)
  fig.appendChild(cap)
  e.appendChild(fig)
  e = document.getElementById('trans_image');
  img = document.createElement("img");
  img.src = "../" + structure[study_nbr]["image_path_transformed"];
  cap = document.createElement("figcaption");
  cap.textContent = "Width:" + img.width + " Height:" + img.height //ToDo: Why is reload needed
  cap.classList.add("text-center")
  img.classList.add("img-thumbnail");
  fig = document.createElement("figure");
  fig.appendChild(img)
  fig.appendChild(cap)
  e.appendChild(fig)
}
function add_models_to_section() {
  const e = document.getElementById("models");
  let images, caps, links;
  let column, row;
  models_v1.sort((a, b) => (a.values.model_name > b.values.model_name) ? 1 : ((b.values.model_name > a.values.model_name) ? -1 : 0))
  models_v1.forEach((model, i) => {
    column = i % 4;
    row = Math.trunc((i / 4));
    if (column == 0) {
      images = [];
      caps = [];
      links = [];
      let row_maps = document.createElement('div');
      row_maps.classList.add("row", "flex-nowrap", "g-0");
      for (let j = 0; j < 4; j++) {
        let column_maps = document.createElement('div');
        column_maps.classList.add("col-3", "col-pixel-width-100");
        let link = document.createElement('a')
        link.href = "https://google.com"
        links.push(link);
        let img = document.createElement("img");
        img.classList.add("img-thumbnail");
        img.src = "images/placeholder.png"
        images.push(img);
        let cap = document.createElement("figcaption");
        cap.textContent = "-"
        cap.classList.add("text-left", "small")
        caps.push(cap);
        let fig = document.createElement("figure");
        link.appendChild(img);
        fig.appendChild(link);
        fig.appendChild(cap);
        column_maps.appendChild(fig);
        row_maps.appendChild(column_maps);
      };
      e.appendChild(row_maps);
    }
    images[column].src = "images/neural_network.png";
    links[column].href = "model.html?id=" + model.name;
    let weights = "None"
    if ((model.values.weights).split(".").length > 0) {
      weights = (model.values.weights).split(".")[1]
    }
    caps[column].innerHTML = `<i>Model: </i>${model.values.model_name} 
    <br/><i>Transforms used:</i> ${model.values.transformation}
    <br/> <i>Weights used:</i> ${weights}
    <br/> <i>Number epocs: </i> ${model.values.num_epocs}
    <br/> <i>Accuracy:</i> ${model.values.training["test_" + (model.values.num_epocs - 1)].epoch_acc}
    <br/> <i>Loss::</i> ${model.values.training["test_" + (model.values.num_epocs - 1)].test_loss}
    <br/> <i>Datetime for training:</i> ${model.values.time}`;
    console.log("Row:", row, " Column: ", column)
    console.log("______________")
    console.log("Model number" + i)
    console.log(model)
    console.log("Model name:" + model.values.model_name);
    console.log("transforms used: " + model.values.transformation);
    console.log("training time: " + model.values.time);
    console.log("number epocs: " + model.values.num_epocs);
    console.log("Weights used: " + model.values.weights);
    console.log("Accuracy" + model.values.training["test_" + (model.values.num_epocs - 1)].epoch_acc);
    console.log("Loss: " + model.values.training["test_" + (model.values.num_epocs - 1)].test_loss);

  });
}
function add_add_Models(element, classnumber) {
  let paths_to_saliency_maps = [];
  let class_probabilities = [];
  let model_names = [];
  let mean_values = [];
  let std_values = [];
  let mean_from_pos_value = [];
  let mean_from_neg_value = [];
  let std_from_pos_value = [];
  let std_from_neg_value = [];
  models_v1.forEach((model, i) => {
    let path_to_saliency_map = model.get_saliency_map_for_class(classnumber);
    if (path_to_saliency_map.length > 0) {
      paths_to_saliency_maps.push(path_to_saliency_map);
      class_probabilities.push(model.get_class_prob_for_label(classnumber));
      model_names.push(model.get_model_name());
      mean_values.push(model.get_mean_raw_value(classnumber));
      std_values.push(model.get_std_raw_value(classnumber));
      mean_from_pos_value.push(model.get_mean_from_pos_value(classnumber));
      mean_from_neg_value.push(model.get_mean_from_neg_value(classnumber));
      std_from_pos_value.push(model.get_std_from_pos_value(classnumber));
      std_from_neg_value.push(model.get_std_from_neg_value(classnumber));
    };
  });
  let images;
  let column;
  let caps;
  paths_to_saliency_maps.forEach((map_path, i) => {
    column = i % 4;
    if (column == 0) {
      images = [];
      caps = [];
      let row_maps = document.createElement('div');
      row_maps.classList.add("row", "flex-nowrap", "g-0");
      for (let j = 0; j < 4; j++) {
        let column_maps = document.createElement('div');
        column_maps.classList.add("col-3", "col-pixel-width-100");
        let img = document.createElement("img");
        img.classList.add("img-thumbnail");
        //img.src = "images/placeholder.png"
        images.push(img);
        let cap = document.createElement("figcaption");
        cap.textContent = "-"
        cap.classList.add("text-left", "small")
        caps.push(cap);
        let fig = document.createElement("figure");
        fig.appendChild(img);
        fig.appendChild(cap);
        column_maps.appendChild(fig);
        row_maps.appendChild(column_maps);
      };
      element.appendChild(row_maps);
    }
    //Here only add image so no placeholder is needed.....!!!!!!
    images[column].src = "../" + map_path;
    caps[column].innerHTML = "<i>Model: </i>" + model_names[i] +
      " <br/><i>Class probability:</i> " + (class_probabilities[i] * 100).toFixed(1) + "%" +
      "<br/> <i>Mean value:</i> " + (mean_values[i]).toFixed(2) +
      "<br/> <i>Std value:</i> " + (std_values[i]).toFixed(2) +
      "<br/> <i>Mean of pos values:</i> " + (mean_from_pos_value[i]).toFixed(2) +
      "<br/> <i>Mean of neg values:</i> " + (mean_from_neg_value[i]).toFixed(2) +
      "<br/> <i>Std of pos values:</i> " + (std_from_pos_value[i]).toFixed(2) +
      "<br/> <i>Std of neg values:</i> " + (std_from_neg_value[i]).toFixed(2);
  });
}
// OLD BELOW
function set_predictions() {
  const e = document.getElementById('predictions');
  let row_model, column_model, model_name;
  let labels, preds, label, pred;
  let row_models = [];
  let columns_pred_labels = [];
  let columns_pred_values = [];
  let row_pred;
  let column, row;
  models_v1.forEach((model, i) => {
    column = i % 4;
    row = Math.trunc((i / 4));
    if (column === 0) {
      row_models = [];
      columns_pred_labels = [];
      columns_pred_values = [];
      row_model = document.createElement('div');
      row_model.classList.add("row", "flex-nowrap", "g-0");
      row_pred = document.createElement('div');
      row_pred.classList.add("row", "flex-nowrap", "g-0");
      for (let i = 0; i < 4; i++) {
        //Model names
        column_model = document.createElement('div');
        column_model.classList.add('col-3', 'col-pixel-width-100');
        model_name = document.createElement('p')
        model_name.classList.add("text-center");
        model_name.textContent = "-";
        row_models.push(model_name);
        column_model.appendChild(model_name);
        row_model.appendChild(column_model);
        //Prediction part.
        labels = document.createElement('div');
        labels.classList.add('col-2');
        label = document.createElement('div');
        label.innerHTML = '<b>Prediction</b>'
        columns_pred_labels.push(label)
        labels.appendChild(label);
        row_pred.appendChild(labels);
        preds = document.createElement('div');
        preds.classList.add('col-1');
        pred = document.createElement('div');
        pred.innerHTML = '%';
        columns_pred_values.push(pred);
        preds.appendChild(pred);
        row_pred.appendChild(preds);
      }
      e.appendChild(row_model);
      e.appendChild(row_pred);
      e.appendChild(document.createElement('hr'));
    }
    row_models[column].innerHTML = '<b>' + model.name + '</b>';
    for (let i = 0; i < number_of_probabilities_to_show; i++) {
      label = document.createElement('div');
      label.classList.add('small');
      label.innerHTML = model.values[i]['label']
      pred = document.createElement('div');
      pred.classList.add('small');
      pred.innerHTML = (model.values[i]['probability'] * 100).toFixed(1);
      columns_pred_labels[column].appendChild(label);
      columns_pred_values[column].appendChild(pred);
    }
  });
}
function compare_models() {
  const e = document.getElementById("compare_models");
  let row_e, column_e;
  //For all preds
  probs_v1.forEach((prob_v1, i) => {
    row_e = document.createElement('div');
    row_e.classList.add("row", "flex-nowrap", "g-0");
    column_e = document.createElement('div');
    column_e.classList.add('col-12');
    let h3_ = document.createElement('h3');
    h3_.classList.add("text-center", "text-capitalize");
    h3_.innerHTML = prob_v1.label;
    let p_ = document.createElement('p');
    p_.classList.add("text-start", "small");

    p_.innerHTML = "Saliency maps for the label <b>" + prob_v1.label + " </b> with max class probability <b>" +
      (prob_v1.maxProbability * 100).toFixed(1) + "%</b>. The models tested have the mean class probability <b>" +
      (prob_v1.get_average_prob() * 100).toFixed(1) + "%</b>" + " and the label is among acc@5 for: <b>" +
      prob_v1.get_number_prob() + "</b> of the models";
    column_e.appendChild(h3_);
    column_e.appendChild(p_);
    row_e.appendChild(column_e);
    let hr_ = document.createElement('hr');
    e.appendChild(hr_);
    e.appendChild(row_e);
    add_saliency_maps_for_class(e, prob_v1.classnumber);
    add_chart_for_class(e, prob_v1.classnumber);
    add_raw_chart_for_classnumber(e, prob_v1.classnumber);
    add_dispersion_and_mean_for_class(e, prob_v1.classnumber);
    add_chart_for_mean_and_deviation(e, prob_v1.classnumber);
  });
}
function add_saliency_maps_for_class(element, classnumber) {
  let paths_to_saliency_maps = [];
  let class_probabilities = [];
  let model_names = [];
  let mean_values = [];
  let std_values = [];
  let mean_from_pos_value = [];
  let mean_from_neg_value = [];
  let std_from_pos_value = [];
  let std_from_neg_value = [];
  models_v1.forEach((model, i) => {
    let path_to_saliency_map = model.get_saliency_map_for_class(classnumber);
    if (path_to_saliency_map.length > 0) {
      paths_to_saliency_maps.push(path_to_saliency_map);
      class_probabilities.push(model.get_class_prob_for_label(classnumber));
      model_names.push(model.get_model_name());
      mean_values.push(model.get_mean_raw_value(classnumber));
      std_values.push(model.get_std_raw_value(classnumber));
      mean_from_pos_value.push(model.get_mean_from_pos_value(classnumber));
      mean_from_neg_value.push(model.get_mean_from_neg_value(classnumber));
      std_from_pos_value.push(model.get_std_from_pos_value(classnumber));
      std_from_neg_value.push(model.get_std_from_neg_value(classnumber));
    };
  });
  let images;
  let column;
  let caps;
  paths_to_saliency_maps.forEach((map_path, i) => {
    column = i % 4;
    if (column == 0) {
      images = [];
      caps = [];
      let row_maps = document.createElement('div');
      row_maps.classList.add("row", "flex-nowrap", "g-0");
      for (let j = 0; j < 4; j++) {
        let column_maps = document.createElement('div');
        column_maps.classList.add("col-3", "col-pixel-width-100");
        let img = document.createElement("img");
        img.classList.add("img-thumbnail");
        //img.src = "images/placeholder.png"
        images.push(img);
        let cap = document.createElement("figcaption");
        cap.textContent = "-"
        cap.classList.add("text-left", "small")
        caps.push(cap);
        let fig = document.createElement("figure");
        fig.appendChild(img);
        fig.appendChild(cap);
        column_maps.appendChild(fig);
        row_maps.appendChild(column_maps);
      };
      element.appendChild(row_maps);
    }
    //Here only add image so no placeholder is needed.....!!!!!!
    images[column].src = "../" + map_path;
    caps[column].innerHTML = "<i>Model: </i>" + model_names[i] +
      " <br/><i>Class probability:</i> " + (class_probabilities[i] * 100).toFixed(1) + "%" +
      "<br/> <i>Mean value:</i> " + (mean_values[i]).toFixed(2) +
      "<br/> <i>Std value:</i> " + (std_values[i]).toFixed(2) +
      "<br/> <i>Mean of pos values:</i> " + (mean_from_pos_value[i]).toFixed(2) +
      "<br/> <i>Mean of neg values:</i> " + (mean_from_neg_value[i]).toFixed(2) +
      "<br/> <i>Std of pos values:</i> " + (std_from_pos_value[i]).toFixed(2) +
      "<br/> <i>Std of neg values:</i> " + (std_from_neg_value[i]).toFixed(2);
  });
}
function add_chart_for_class(element, classnumber) {
  let chart_canvas = document.createElement('canvas');
  let chart_column = document.createElement('div');
  chart_column.classList.add("col-12");
  chart_column.appendChild(chart_canvas);
  let chart_row = document.createElement('div');
  chart_row.classList.add("row", "flex-nowrap", "g-0", "pb-5");
  chart_row.appendChild(chart_column);
  let XAI_values = []
  const XAI_value = function (mean_values, model_name, target_class_label, colour) {
    this.data = mean_values;
    this.label = model_name;
    this.scrap = target_class_label;
    this.borderColor = colour;
    this.backgroundColor = colour;
  }
  const COLORS = ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba'];
  models_v1.forEach((model, i) => {
    let saliency_values = model.get_saliency_values(classnumber);
    if (saliency_values.length > 0) {
      XAI_values.push(new XAI_value(model.get_saliency_values(classnumber), model.get_model_name(), idx_to_label(classnumber), COLORS[i]));
    }
  });
  const labels = [];
  for (var j = 1; j <= 51; ++j) { labels.push(j) }
  new Chart(chart_canvas, {
    type: 'line',
    data: {
      labels: labels,

      datasets: XAI_values,
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 14
            }
          }
        }
      },
      responsive: true,
      title: {
        display: true,
        text: 'Mean value per square ',
      },
      scales: {
        xAxis: {
          title: {
            display: true,
            text: 'Number of squares accumulated over for the label ' + idx_to_label(classnumber),
            font: {
              size: 20
            }
          },
          ticks: {
            callback: function (val, index) {
              return index % 5 === 0 ? val : '';
            },
            font: {
              size: 20
            }
          }
        },
        yAxis: {
          title: {
            display: true,
            text: 'Accumulated mean POSITIVE Occlusion values.',
            font: {
              size: 20
            }
          },
          suggestedMin: 0,
          suggestedMax: 5,
          ticks: {
            font: {
              size: 20
            }
          }
        }

      }
    }
  });
  element.appendChild(chart_row);
}
function add_raw_chart_for_classnumber(element, classnumber) {
  let chart_canvas = document.createElement('canvas');
  let chart_column = document.createElement('div');
  chart_column.classList.add("col-12");
  chart_column.appendChild(chart_canvas);
  let chart_row = document.createElement('div');
  chart_row.classList.add("row", "flex-nowrap", "g-0", "pb-5");
  chart_row.appendChild(chart_column);
  let XAI_values = []
  const XAI_value = function (raw_values, model_name, target_class_label, colour) {
    this.data = raw_values;
    this.label = model_name;
    this.scrap = target_class_label;
    this.borderColor = colour;
    this.backgroundColor = colour;
  }
  const COLORS = ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba'];
  models_v1.forEach((model, i) => {
    let saliency_values = model.get_raw_values(classnumber);
    if (saliency_values.length > 0) {
      //console.log("classnumber:",classnumber,"saliency_values",saliency_values)
      XAI_values.push(new XAI_value(model.get_raw_values(classnumber), model.get_model_name(), idx_to_label(classnumber), COLORS[i]));
    }
  });
  const labels = [];
  for (var j = 1; j <= 51; ++j) { labels.push(j) }
  new Chart(chart_canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: XAI_values,
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 14
            }
          }
        }
      },
      responsive: true,
      title: {
        display: true,
        text: 'Mean value per square ',
      },
      scales: {
        xAxis: {
          title: {
            display: true,
            text: 'Raw ' + idx_to_label(classnumber),
            font: {
              size: 20
            }
          },
          ticks: {
            callback: function (val, index) {
              return index % 5 === 0 ? val : '';
            },
            font: {
              size: 20
            }
          }
        },
        yAxis: {
          title: {
            display: true,
            text: 'Raw values.',
            font: {
              size: 20
            }
          },
          suggestedMin: 0,
          suggestedMax: 5,
          ticks: {
            font: {
              size: 20
            }
          }
        }

      }
    }
  });
  element.appendChild(chart_row);

}
function add_dispersion_and_mean_for_class(element, classnumber) {
  let found_maps = false;
  let mean_disp_title_row = document.createElement('div');
  mean_disp_title_row.classList.add('row', 'flex-nowrap', 'g-0');
  let mean_disp_title_column = document.createElement('div');
  mean_disp_title_column.classList.add('col-12', 'text-center', "h4")
  mean_disp_title_row.appendChild(mean_disp_title_column);
  element.appendChild(mean_disp_title_row);
  //Mean and dispersion row
  // let images = [];
  // let caps = [];
  let row_maps = document.createElement('div');
  row_maps.classList.add("row", "flex-nowrap", "g-0");
  for (let j = 0; j < 4; j++) {
    let column_maps = document.createElement('div');
    column_maps.classList.add("col-3", "col-pixel-width-100");
    if (j == 1 || j == 2) {
      let img = document.createElement("img");
      img.classList.add("img-thumbnail");
      //img.src = "images/placeholder.png"

      // images.push(img);
      let cap = document.createElement("figcaption");
      cap.textContent = "-"
      cap.classList.add("text-left", "small")
      // caps.push(cap);
      if (j == 1) { //mean
        const path = mean_and_dispersion.get_mean_saliency_map_path(classnumber);
        if (path.length > 0) {
          img.src = path;
          found_maps = true;
          cap.textContent = "Mean saliency map for all models compared. A more green shade indicates more positive correlation between models. (Values (negative) not contributing to the classification (" + idx_to_label(classnumber) + ") are removed.)"
        }
      }
      if (j == 2) { //dispersion
        const path = mean_and_dispersion.get_dispersion_saliency_map_path(classnumber);
        if (path.length > 0) {
          img.src = path;
          cap.textContent = "Mean standard deviation map for all models compared. A more red shade means more disagrement. (Values (negative) not contributing to the classification (" + idx_to_label(classnumber) + ") are removed.)"
        }
      }
      let fig = document.createElement("figure");
      fig.appendChild(img);
      fig.appendChild(cap);
      column_maps.appendChild(fig);
    }
    row_maps.appendChild(column_maps);
  };
  if (found_maps) {
    element.appendChild(row_maps);
    mean_disp_title_column.innerHTML = 'Mean saliency map and dispersion saliency map for <b>' + idx_to_label(classnumber) + '</b>'
  } else {
    mean_disp_title_column.innerHTML = 'No mean saliency map and dispersion saliency maps created for <b>' + idx_to_label(classnumber) + '</b>'
  }

}
function add_chart_for_mean_and_deviation(element, classnumber) {
  let found = false;
  let chart_canvas = document.createElement('canvas');
  let chart_column = document.createElement('div');
  chart_column.classList.add("col-12");
  chart_column.appendChild(chart_canvas);
  let chart_row = document.createElement('div');
  chart_row.classList.add("row", "flex-nowrap", "g-0");
  chart_row.appendChild(chart_column);
  let mean_std_values = []
  const Mean_std_value = function (values, mean_or_std, colour) {
    this.data = values;
    this.label = mean_or_std;
    this.borderColor = colour
    this.backgroundColor = colour;
  }
  const COLORS = ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba'];
  const mean_values = mean_and_dispersion.get_mean_values(classnumber);
  if (mean_values.length > 0) {
    mean_std_values.push(new Mean_std_value(mean_values, "Sorted mean Occlusion value for all squares", COLORS[7]));
    mean_std_values.push(new Mean_std_value(mean_and_dispersion.get_std_values(classnumber), "Sorted standard deviation between models for all squares.", COLORS[8]));
    found = true;
  }
  const labels = [];
  for (var j = 0; j <= 55; ++j) { labels.push(j) }
  new Chart(chart_canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: mean_std_values,
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 14
            }
          }
        }
      },
      responsive: true,
      title: {
        display: true,
        text: 'Sorted values for square ',
      },
      scales: {
        xAxis: {
          title: {
            display: true,
            text: idx_to_label(classnumber),
            font: {
              size: 20
            }
          },
          ticks: {
            callback: function (val, index) {
              return index % 5 === 0 ? val : '';
            },
            font: {
              size: 20
            }
          }
        },
        yAxis: {
          title: {
            display: true,
            text: 'Values',
            font: {
              size: 20
            }
          },
          suggestedMin: 0,
          suggestedMax: 4,
          ticks: {
            font: {
              size: 20
            }
          }
        }

      }
    }
  });
  if (found) {
    element.appendChild(chart_row);
  }
}
 */