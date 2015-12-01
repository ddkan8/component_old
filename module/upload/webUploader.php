<?php

$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["file"]["name"]);
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image
move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);

//if(isset($_POST["submit"])) {
    //echo $target_file;
    /*
    $check = getimagesize($_FILES["file"]["name"]);
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
    */
//}
//move_uploaded_file($_FILES["file"]["name"], $target_file)

?>