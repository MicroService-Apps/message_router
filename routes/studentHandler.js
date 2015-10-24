/**
 * Created by Wayne on 10/24/15.
 */

exports.handleMsg = function (msg){
    var db = require('./../util/mongo.js');
    var student = db.collection('student');
    var response = new Object();
    switch (msg["method"])
    {
        case 'create':
            student.count({Uni: msg["uni"]}, function(err, count) {
                if(count==0){
                    student.insert({Name: msg["name"],Uni: msg["uni"],CourseEnrolled: msg["course"].split(",")},function(err, result) {
                        if (err) {
                            response.status = "failed";
                            response.message = err.toSring();
                        }
                        if (result){
                            response.status = "succeed";
                            response.message = "Student "+msg["name"]+" added";

                        }
                    });
                }
                else{
                    response.status = "failed";
                    response.message = "uni existed";
                }
            });
            break;

        case 'update':
            if(student.count({Uni: msg["uni"]})==0){
                response.status = "failed";
                response.message = "uni "+msg["uni"]+" does not exist.";
            }
            else{
                if(msg["name"]){
                    student.update({Uni: msg["uni"]},{'$set':{Name: msg["name"]}},function(err,result){
                        if(err){
                            response.status = "failed";
                            response.message = err.toSring();
                        }
                    });
                }

                if(msg["course"]){
                    if(msg["courseAction"]=="Add"){
                        student.findOne({Uni: msg["uni"]},function(err, result) {
                            if (err) {
                                response.status = "failed";
                                response.message = err.toSring();
                            }
                            if (result){
                                var course = result.CourseEnrolled;
                                if(course.indexOf(msg["course"])==-1){
                                    course.push(msg["course"]);
                                    student.update({Uni: msg["uni"]},{'$set':{CourseEnrolled: course}},function(err,result){
                                        if(err){
                                            response.status = "failed";
                                            response.message = err.toSring();
                                        }
                                        if(result){
                                            response.status = "succeed";
                                            response.message = "course "+msg["course"]+" is added to Student(Uni:"+msg["uni"]+").";
                                        }
                                    });
                                }
                                else{
                                    response.status = "failed";
                                    response.message = "course already enrolled by Student(Uni:"+msg["uni"]+").";
                                }
                            }
                        });
                    }
                    else if(msg["courseAction"]=="Del"){

                        student.findOne({Uni: msg["uni"]},function(err, result) {
                            if (err) {
                                response.status = "failed";
                                response.message = err.toSring();
                            }
                            if (result){
                                var course = result.CourseEnrolled;
                                if(course.indexOf(msg["course"])!=-1){
                                    course.splice(course.indexOf(msg["course"]),1);
                                    student.update({Uni: msg["uni"]},{'$set':{CourseEnrolled: course}},function(err,result){
                                        if(err) {
                                            response.status = "failed";
                                            response.message = err.toSring();
                                        }
                                        if(result){
                                            response.status = "succeed";
                                            response.message = "course "+msg["course"]+" is deleted from Student(Uni:"+msg["uni"]+").";
                                        }
                                    });
                                }
                                else{
                                    response.status = "failed";
                                    response.message = "Student("+msg["uni"]+") does not enroll this course.";
                                }
                            }
                        });

                    }
                }
            }
            break;

        case 'read':
            var query = new Object();
            if(msg["name"]) query.Name = msg["name"];
            if(msg["uni"]) query.Uni = msg["uni"];
            if(msg["course"]) query.CourseEnrolled = msg["course"];

            student.count({Uni: msg["uni"]}, function(err, count) {
                if(count>0){
                    student.find(query).toArray(function(err, result) {
                        if (err) {
                            response.status = "failed";
                            response.message = err.toSring();
                        }
                        if (result){
                            response.status = "succeed";
                            response.message = "";
                            response.body = result;
                        }
                    });
                }
                else{
                    response.status = "failed";
                    response.message = "no student match your request";
                }
            });
            break;

        case 'delete':
            student.count({Uni: msg["uni"]}, function(err, count) {
                if(count>0){
                    student.remove({Uni: msg["uni"]},function(err, result) {
                        if (err) {
                            response.status = "failed";
                            response.message = err.toSring();
                        }
                        else{
                            response.status = "failed";
                            response.message = "student("+msg["uni"]+") removed";
                        }
                    });
                }
                else{
                    response.status = "failed";
                    response.message = "no student match your request";
                }
            });
            break;

        case 'config':
            break;
        default :
            break;

    }

    return response;


};




