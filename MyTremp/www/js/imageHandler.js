var imgs =
{
    checkTakePicture: function()
    {
        alertify.set({ labels: {ok: "צלם",cancel : "בטל" } });
        alertify.confirm('האם ברצונך לצלם את הנהג/הרכב לפני העליה לטרמפ?',
            function(ok)
            {
                if (!ok)
                {
                    return;
                }
                imgs.takePicture();
            }
        );
    },
    takePicture: function()
    {
        var success =
            function (imgData)
            {

                // Save image to server
                var imonarideImageAPI = "http://codletech.net/imonaride/saveImage.php";
                var data =
                {
                    phone_number: window.localStorage.getItem("phoneNumber"), // Safe phone number get.
                    image_data: imgData
                };

                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", imonarideImageAPI);
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlhttp.send(JSON.stringify(data));


                //Save image to device
                var myCanvas = document.createElement('canvas');
                var ctx = myCanvas.getContext('2d');
                var img = new Image;
                img.onload = function(){
                    ctx.drawImage(img,0,0);
                    // Save image to device.
                    window.canvas2ImagePlugin.saveImageDataToLibrary(
                        function(msg){
                            alertify.set({ labels: {ok: "תודה"} });
                            alertify.alert('התמונה צולמה ונשלחה לשרתינו בהצלחה!');
                        },
                        function(err){
                            window.console.log(err);
                        },
                        myCanvas
                    );
                };
                img.src = "data:image/jpeg;base64," + imgData;
            };
        var error =
            function (message)
            {
                alertify.set({ labels: {ok: "אישור"} });
                alertify.alert('צילום התמונה נכשל, נסה שוב');
            };

        // Take picture.
        navigator.camera.getPicture(success, error, { quality: 40,
            sourceType: Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.DATA_URL,
            EncodingType: Camera.EncodingType.PNG,
            targetWidth: 800,
            targetHeight: 800

        });

    }
}