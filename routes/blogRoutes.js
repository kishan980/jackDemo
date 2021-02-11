const express = require("express");
const blogController = require("./../controller/blogController");
const appConfing = require("./../config/appConfig");
const  swggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const options ={
    definition:{
        info:{
            title:"Swagger Task Api",
            version:'1.0.0',
            description:''
        },
    },
    apis:['./routes/*.js']
}
// const middleware = require("./../middleware/example");

let setRouter = (app) =>{
  
    let baseUrl =appConfing.apiVersion+'/blog';
    const swaggerSpec = swaggerJSDoc(options);
    app.use(baseUrl+'/api/docs/', swggerUI.serve, swggerUI.setup(swaggerSpec));
    console.log(baseUrl);
    app.get(baseUrl+"/all",blogController.getAllBlog);
 /**
 * @swagger
 * /api/v10/blog/all:
 *   get:
 *     tags:
 *       - Blog
 *     description: Returns all blog
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of blog
 *         schema:
 *  
 */
    // app.get(baseUrl+"/viewById/:blogId",  middleware.examplemiddleware,blogController.getViewById);
    app.get(baseUrl+"/:blogId/viewById", blogController.getViewById);
/**
 * @swagger
 * /api/v10/blog/viewById/{blogId}:
 *   get:
 *     tags:
 *       - Blog
 *     description: Returns a single blog
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: blogId
 *         description: blogId single Details find found
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single blog
 *         schema:
 *           $ref: '#/definitions/:blogId/viewById'
 */

    app.delete(baseUrl+"/:blogId/delete", blogController.deleteBlog);
       /**
 * @swagger
 * /api/v10/blog/{blogId}/delete:
 *   post:
 *     tags:
 *       - Blog
 *     description: Deletes a single Blog
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: blogId
 *         description: blogId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully categoryId deleted
 */
    app.put(baseUrl+"/:blogId/update", blogController.updateBlog);
    /**
 @swagger     
 *  /api/v10/blog/{blogId}/update:  
 *    put:   
 *      tags:    
 *        - Blog     
 *      description: Updates a single  Blog 
 *      produces:    
 *        - application/json     
 *      parameters:  
 *        - name: Question   
 *          description: Question object resources   
 *          in: body     
 *          required: true   
 *          schema:  
 *            $ref: '#/components/schemas/update'  
 *        - name: blogId     
 *          description: Blog Object ID  
 *          in: path     
 *          required: true   
 *      responses:   
 *        200:   
 *          description: Successfully Edit category  
 *        500:   
 *          description: Server error
 * */

    /**
 * @swagger
 * /api/v10/blog/created:
 *   post:
 *     tags:
 *       - Blog
 *     description: Creates a new blog
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: BlogId
 *         description: Blog object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/created'
 *     responses:
 *       200:
 *         description: Successfully created
 */
    app.post(baseUrl+"/created", blogController.createBlog)
    /**
 * @swagger
 * /api/v10/blog/{blogId}/incrementViewById:
 *   get:
 *     tags:
 *       - Blog
 *     description: Returns a single blog
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: blogId
 *         description: blogId single Details find found
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single blog
 *         schema:
 *           $ref: '#/definitions/:blogId/incrementViewById'
 */
}

module.exports = {
    setRouter:setRouter
}