#!/usr/bin/env node
var amqp = require('amqp');
var connection = amqp.createConnection({host:'127.0.0.1'});

var rpc = new (require('./amqprpc'))(connection);
var serviceType = 'course';

exports.execute = function(req, res) {
    var body = req.body;
    var method = body.method;

    switch(method) {
        case 'create':
            handleCreate(body, res);

            break;
        case 'read':
            handleRead(body, res);

            break;
        case 'update':
            handleUpdate(body, res);

            break;
        case 'delete':
            handleDelete(body, res);

            break;
        case 'config':
            handleConfig(body, res);

            break;
        default:
            res.send('No such method');

            break;
    }


}

// handle create method
function handleCreate(body, res) {
    sendToCourse(body, function response(err, response){
        if(err) {
            if(err.code == 'ECONNRESET') {
                //handle the reponse timeout
                console.error('response timeout');
            }
            else
                console.error(err);
        }
        else {
            console.log("response", response);
            res.send(response);
        }
    });
}

// handle read method
function handleRead(body, res) {
    sendToCourse(body, function response(err, response){
        if(err) {
            if(err.code == 'ECONNRESET') {
                //handle the reponse timeout
                console.error('response timeout');
            }
            else
                console.error(err);
        }
        else {
            console.log("response", response);
            res.send(response);
        }
    });
}

// handle update method
function handleUpdate(body, res) {
    sendToCourse(body, function response(err, response){
        if(err) {
            if(err.code == 'ECONNRESET') {
                //handle the reponse timeout
                console.error('response timeout');
            }
            else
                console.error(err);
        }
        else
            console.log("response", response);
    });
}

// handle delete method
function handleDelete(body, res) {
    sendToCourse(body, function response(err, response){
        if(err) {
            if(err.code == 'ECONNRESET') {
                //handle the reponse timeout
                console.error('response timeout');
            }
            else
                console.error(err);
        }
        else {
            console.log("response", response);
            res.send(response);
        }
    });
}

// handle config method
function handleConfig(body, res) {
    sendToCourse(body, function response(err, response){
        if(err) {
            if(err.code == 'ECONNRESET') {
                //handle the reponse timeout
                console.error('response timeout');
            }
            else
                console.error(err);
        }
        else {
            console.log("response", response);
            res.send(response);
        }
    });
}

// Send message to course service
function sendToCourse(message, response) {
    rpc.makeRequest(serviceType, message, response);
}