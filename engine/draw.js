Fortis.Game.draw = function (delta) {
    if (Fortis.Game.scene == null) return Fortis.error.SceneNotSet();//シーンが設定されているか
    //camera.context.clearRect(0, 0, Fortis.Game.canvasCfg.size.x, Fortis.Game.canvasCfg.size.y);//オフスクリーンキャンバスの初期化
    Fortis.Game.scene.layer.forEach(layer => {
        layer.camera.context.clearRect(0, 0, layer.camera.canvas.width, layer.camera.canvas.height);//オフスクリーンキャンバスの初期化
        //Fortis.Game.canvas.width = layer.camera.displayRange.x;
        //Fortis.Game.canvas.height = layer.camera.displayRange.y;
        /*
        camera.context.save();
        camera.context.globalCompositeOperation = "source-in"
        Fortis.draw.setFillColor(camera,new Fortis.Color(0,0,0,1));
        camera.context.fillRect(0, 0, Fortis.Game.canvasCfg.size.x, Fortis.Game.canvasCfg.size.y);//オフスクリーンキャンバスの初期化
        camera.context.restore();
        */
        repeatIdentifyingEntity(layer.camera, layer, false);
        /*
        layer.camera.context.save();
        layer.camera.context.globalCompositeOperation = "destination-in";
        layer.camera.context.translate(layer.camera.startPos.x+layer.camera.canvas.width/2-layer.camera.centerPos.x*layer.camera.scale.x, layer.camera.startPos.y+layer.camera.canvas.height/2-layer.camera.centerPos.y*layer.camera.scale.y);
        layer.camera.context.rotate(Fortis.util.degreeToRadian(layer.camera.angle));
        //layer.camera.context.scale(layer.camera.scale.x, layer.camera.scale.y);
        Fortis.draw.setFillColor(layer.camera,new Fortis.Color(0,0,0,1));
        //layer.camera.context.fillRect(layer.camera.startPos.x,layer.camera.startPos.y,layer.camera.displayRange.x,layer.camera.displayRange.y);
        layer.camera.context.restore();
        */
        //layer.camera.shot();
    });

    //実際に表示されるキャンバスの処理
    //Fortis.Game.finalContext.globalCompositeOperation = "source-over";
    Fortis.Game.finalContext.clearRect(0, 0, Fortis.Game.canvasCfg.size.x*2, Fortis.Game.canvasCfg.size.y*2);
    Fortis.Game.finalContext.fillStyle = Fortis.Game.canvasCfg.BGColor.toHex();
    Fortis.Game.finalContext.fillRect(0, 0, Fortis.Game.canvasCfg.size.x, Fortis.Game.canvasCfg.size.y);
    //console.log(Fortis.Game.canvasCfg.size.x)
    Fortis.Game.scene.layer.forEach(layer => {
        //console.log(layer.camera)
        Fortis.Game.finalContext.save();
        Fortis.Game.finalContext.translate(layer.camera.pos.x + layer.camera.centerPos.x, layer.camera.pos.y + layer.camera.centerPos.y);
        Fortis.Game.finalContext.rotate(Fortis.util.degreeToRadian(layer.camera.angle));
        //console.log(layer.camera.displayRange.x, layer.camera.displayRange.y, -layer.camera.centerPos.x, -layer.camera.centerPos.y, layer.camera.size.x * layer.camera.scale.x, layer.camera.size.y * layer.camera.scale.y)
        Fortis.Game.finalContext.drawImage(layer.camera.canvas, 0, 0, layer.camera.displayRange.x, layer.camera.displayRange.y, -layer.camera.centerPos.x, -layer.camera.centerPos.y, layer.camera.size.x * layer.camera.scale.x, layer.camera.size.y * layer.camera.scale.y);
        //console.log(layer.camera.size)
        Fortis.Game.finalContext.restore();
    });
    //Fortis.Game.finalContext.globalCompositeOperation = "destination-in";
    //Fortis.Game.finalContext.fillRect(0, 0, Fortis.Game.canvasCfg.size.x, Fortis.Game.canvasCfg.size.y);

    //Fortis.Game.finalContext.drawImage(Fortis.Game.canvas.transferToImageBitmap(), 0, 0, Fortis.Game.canvasCfg.size.x, Fortis.Game.canvasCfg.size.y);

    function repeatIdentifyingEntity(camera, array, mode) {//arrayにlayerもしくはContainer、modeにtrueかfalse(containerならtrue)
        array.entity.forEach(tmpEntity => {
            let entity = tmpEntity;
            if (entity.type != "CustomRenderFunction") {
                camera.context.save();
                if (mode) {
                    entity = tmpEntity["entity"];
                    camera.context.globalCompositeOperation = tmpEntity["composite"];
                } else {
                    camera.context.globalCompositeOperation = "source-over";
                }
                if (entity.type == "EntityContainer") {
                    repeatIdentifyingEntity(camera,entity, true);
                } else {
                    if(entity.alpha!=0){
                    camera.context.globalAlpha = entity.alpha;
                    //console.log(length * Math.sin(Fortis.util.degreeToRadian(degree + array.camera.angle))+ array.camera.pos.x+array.camera.canvas.width/2)
                    //console.log(entity)
                    camera.context.translate(entity.pos.x-camera.startPos.x, entity.pos.y-camera.startPos.y);
                    camera.context.rotate(Fortis.util.degreeToRadian(entity.angle));
                    camera.context.scale(entity.scale.x, entity.scale.y);
                    switch (entity.shape.type) {
                        case "LineShape":
                            Fortis.draw.line(camera, entity);
                            break
                        case "RectShape":
                            Fortis.draw.rect(camera, entity);
                            break
                        case "CircleShape":
                            Fortis.draw.circle(camera, entity);
                            break
                        case "EllipseShape":
                            Fortis.draw.ellipse(camera, entity);
                            break
                        case "RegPolygonShape":
                            Fortis.draw.regPolygon(camera, entity);
                            break
                        case "PolygonShape":
                            Fortis.draw.polygon(camera, entity);
                            break
                        case "TextShape":
                            Fortis.draw.text(camera, entity);
                            break
                        case "ImageShape":
                            Fortis.draw.image(camera, entity);
                            break
                        case "SpriteShape":
                            Fortis.draw.image(camera, entity, true);
                            break
                    }
                    camera.context.restore();
                }
                }
            } else {
                entity.func(delta);
            }
        });
    }
}

Fortis.draw.line = function (camera, entity) {
    if (entity.material.stroke != false) {
        camera.context.beginPath();
        camera.context.moveTo(entity.shape.distance.x, entity.shape.distance.y);
        camera.context.lineTo(entity.shape.distance.x + entity.shape.vector.x, entity.shape.distance.y + entity.shape.vector.y);
        Fortis.draw.setStrokeColor(camera, entity.material.stroke);
        camera.context.lineWidth = entity.material.thick;
        camera.context.stroke();
        camera.context.closePath();
    }
}

Fortis.draw.rect = function (camera, entity) {
    let size = entity.shape.size.copy();
    //console.log(entity.shape.distance.x - size.x / 2)
    if (entity.material.fill != false) {
        Fortis.draw.setFillColor(camera, entity.material.fill);
        camera.context.fillRect(entity.shape.distance.x - size.x / 2, entity.shape.distance.y - size.y / 2, size.x, size.y);
    }
    if (entity.material.stroke != false) {
        Fortis.draw.setStrokeColor(camera, entity.material.stroke);
        camera.context.lineWidth = entity.material.thick;
        camera.context.strokeRect(entity.shape.distance.x - size.x / 2, entity.shape.distance.y - size.y / 2, size.x, size.y);
    }
}

Fortis.draw.circle = function (camera, entity) {
    camera.context.beginPath();
    camera.context.arc(entity.shape.distance.x, entity.shape.distance.y, entity.shape.radius, 0, Fortis.util.degreeToRadian(entity.shape.degree));
    if (entity.material.fill != false) {
        Fortis.draw.setFillColor(camera, entity.material.fill);
        camera.context.fill();
    }
    if (entity.material.stroke != false) {
        Fortis.draw.setStrokeColor(camera, entity.material.stroke);
        camera.context.lineWidth = entity.material.thick;
        camera.context.stroke();
    }
    camera.context.closePath();
}

Fortis.draw.ellipse = function (camera, entity) {
    camera.context.beginPath();
    camera.context.ellipse(entity.shape.distance.x, entity.shape.distance.y, entity.shape.radSize.x, entity.shape.radSize.y, 0, 0, Fortis.util.degreeToRadian(entity.shape.degree));
    if (entity.material.fill != false) {
        Fortis.draw.setFillColor(camera, entity.material.fill);
        camera.context.fill();
    }
    if (entity.material.stroke != false) {
        Fortis.draw.setStrokeColor(camera, entity.material.stroke);
        camera.context.lineWidth = entity.material.thick;
        camera.context.stroke();
    }
    camera.context.closePath();
}

Fortis.draw.regPolygon = function (camera, entity) {
    camera.context.beginPath();

    let vertices;
    if (entity.shape.vertices == false) {
        vertices = entity.shape.getPolyVertices();
    } else {
        vertices = entity.shape.vertices;
    }
    let vertice_count = 0;
    vertices.forEach(vertice => {
        if (vertice_count == 0) {
            camera.context.moveTo(entity.shape.distance.x + vertice.x, entity.shape.distance.y + vertice.y);
        } else {
            camera.context.lineTo(entity.shape.distance.x + vertice.x, entity.shape.distance.y + vertice.y);
        }
        vertice_count++;
    });
    if (entity.material.fill != false) {
        Fortis.draw.setFillColor(camera, entity.material.fill);
        camera.context.closePath();
        camera.context.fill();
    }
    if (entity.material.stroke != false) {
        camera.context.lineTo(entity.shape.distance.x + vertices[0].x, entity.shape.distance.y + vertices[0].y);
        Fortis.draw.setStrokeColor(camera, entity.material.stroke);
        camera.context.lineWidth = entity.material.thick;
        camera.context.closePath();
        camera.context.stroke();
    }
}

Fortis.draw.polygon = function (camera, entity) {
    camera.context.beginPath();

    let vertices = entity.shape.vertices
    let vertice_count = 0;
    vertices.forEach(vertice => {
        if (vertice_count == 0) {
            camera.context.moveTo(entity.shape.distance.x + vertice.x, entity.shape.distance.y + vertice.y);
        } else {
            camera.context.lineTo(entity.shape.distance.x + vertice.x, entity.shape.distance.y + vertice.y);
        }
        vertice_count++;
    });

    if (entity.material.fill != false) {
        Fortis.draw.setFillColor(camera, entity.material.fill);
        camera.context.closePath();
        camera.context.fill();
    }
    if (entity.material.stroke != false) {
        camera.context.lineTo(entity.shape.distance.x + vertices[0].x, entity.shape.distance.y + vertices[0].y);
        Fortis.draw.setStrokeColor(camera, entity.material.stroke);
        camera.context.lineWidth = entity.material.thick;
        camera.context.closePath();
        camera.context.stroke();
    }
}

Fortis.draw.text = function (camera, entity) {
    camera.context.textAlign = "center";
    camera.context.textBaseline = "middle";
    camera.context.font = entity.shape.font.output();
    camera.context.direction = entity.shape.direction;
    if (entity.material.fill != false) {
        Fortis.draw.setFillColor(camera, entity.material.fill);
        camera.context.fillText(entity.shape.text, entity.shape.distance.x, entity.shape.distance.y);
    }
    if (entity.material.stroke != false) {
        Fortis.draw.setStrokeColor(camera, entity.material.stroke);
        camera.context.strokeText(entity.shape.text, entity.shape.distance.x, entity.shape.distance.y);
    }
}

Fortis.draw.image = function (camera, entity, sprite) {
    let size = entity.shape.size.copy();
    if (sprite) {
        camera.context.drawImage(Fortis.ImageLoader.getImg(entity.material.key), entity.shape.clipSize.x * ((entity.shape.nowFrame - 1) % entity.shape.aspect.x), entity.shape.clipSize.y * Math.floor((entity.shape.nowFrame - 1) / entity.shape.aspect.x), entity.shape.clipSize.x, entity.shape.clipSize.y, entity.shape.distance.x - size.x / 2, entity.shape.distance.y - size.y / 2, size.x, size.y);
    } else if (entity.shape.clipPos === undefined) {
        camera.context.drawImage(Fortis.ImageLoader.getImg(entity.material.key), entity.shape.distance.x - size.x / 2, entity.shape.distance.y - size.y / 2, size.x, size.y);
    } else {
        camera.context.drawImage(Fortis.ImageLoader.getImg(entity.material.key), entity.shape.clipPos.x, entity.shape.clipPos.y, entity.shape.clipSize.x, entity.shape.clipSize.y, entity.shape.distance.x - size.x / 2, entity.shape.distance.y - size.y / 2, size.x, size.y);
    }
}

Fortis.draw.setFillColor = function (camera, color) {
    if (color.type.indexOf("Gradation") == -1) {
        camera.context.fillStyle = color.toRGBA();
    } else {
        camera.context.fillStyle = color.gradation;
    }
}

Fortis.draw.setStrokeColor = function (camera, color) {
    if (color.type.indexOf("Gradation") == -1) {
        camera.context.strokeStyle = color.toRGBA();
    } else {
        camera.context.strokeStyle = color.gradation;

    }
}