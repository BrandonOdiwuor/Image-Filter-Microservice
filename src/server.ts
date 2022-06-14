import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get("/filteredimage", async (req, res) => {
    const { image_url } = req.query;

    if ( !image_url ) { // Check if the image_url is provided
      return res.status(400).send(`image_url is required`);
    }

    try {
      // Filter the image
      const filteredpath = await filterImageFromURL(image_url);

      // Send the file to the User if successfully filtered
      res.status(200).sendFile(filteredpath, () => {
        // Delete Filtered Image file from the server
        deleteLocalFiles([filteredpath]);
      });
      return;
    } catch {
      // Send error if the image cannot be proccesed from the provide URL
      return res.status(422)
                .send("The provided Image URL could not be processed, Try diffrent image_url");
    }
  });//! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();