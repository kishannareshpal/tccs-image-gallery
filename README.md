<img src="./frontend/public/logo192.png" width="84" />

## Image Gallery

A full-stack gallery web application that allows anyone to view other galleries or create their own and upload photos into it.

##### Technical overview

This is a full-stack application which runs [react.js](https://github.com/facebook/react) in [🗂 front-end](frontend) and [Laravel Lumen](https://github.com/laravel/lumen) in [back-end](backend) as a RESTful API.

It also uses [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/s3/) for storing any photos uploaded by the user, in conjuction with a [MySQL database](https://www.mysql.com/) for storing various other data.

> Before any photo is stored, it is resized to form a thumbnail which is stored alongside the original version of the photo. This thumbnail is shown when listing the gallery photos, and the original photo is shown when the user opens to preview the photo.

For authentication, the application uses the Password and Token-based Authentication. _See [JSON Web Tokens (JWT)](https://jwt.io/)_

Lastly it provides docker/docker-compose files to ease running the application.

##### Project requirements

:white_check_mark: Anyone should be able to view photos galleries on the website.\
:white_check_mark: Only registered users will be able to create photo galleries and upload pictures.\
:white_check_mark: A user as a minimum should provide an email and password to register.\
:white_check_mark: A user should be able to add, edit and delete their own galleries.\
:white_check_mark: A user should be able to add, edit and delete their own photos.\
:white_check_mark: Only the owner of a gallery can add, edit or delete photos in that gallery.\
:white_check_mark: Viewing a gallery should show a list of thumbnails.\
:white_check_mark: Clicking on a thumbnail image in a gallery should display the full image.

<hr>

:white_check_mark: Complete in 1 week.\
:white_check_mark: Make appropriate use of well estabilished libraries and frameworks.\
:white_check_mark: Pages must be restricted to ensure that user-only tasks are restricted to logged in users and the correct user.\
:white_check_mark: Thumbnail images should be precomputed to prevent the browser or web server having to scale down large images on the fly for the purpose of displaying thumbnails.\
:white_check_mark: Demonstrate best practices

<hr>

:white_large_square: A user should be able to view a photo gallery as a slideshow which transitions automatically from one image to another.\
:white_large_square: Allow the user to crop an uploaded image via the website as part of the upload process or an edit photo process.\
:white_check_mark: Custom error pages that display friendly error messages.\
:white_check_mark: Package the application in docker/docker-compose so that it can easily be run by anyone.

#### Getting started

> ###### Notes:
>
> This app stores the uploaded photos to the AWS S3 service. In order to [get your credentials for the app](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys), please:
>
> 1. Sign in to the AWS S3 Console
> 2. Create a bucket named `tccsimagegallery` in the `us-east-2` region and with `all` public access allowed.

<details>
    <summary>Run using docker/docker-compose</summary>

1. Clone the repository

2. Navigate to `tccs-image-gallery/backend/` and execute:

```bash
# Copy the example .env file and configure it
cp .env.example .env

# Open the .env file
nano .env

# Edit with your configurations
...
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=imagegallery # or your own db name (you will need to have this mysql database create on your machine)
DB_USERNAME= # insert db username
DB_PASSWORD= # insert db password

# see https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys
AWS_ACCESS_KEY_ID= # insert
AWS_SECRET_ACCESS_KEY= # insert
...
```

3. Navigate to the root of the repo (`tccs-image-gallery`) and execute:

```bash
# Build the docker images (ig-db, ig-backend, ig-frontend)
docker-compose --env-file backend/.env build

# Start up the containers in dettached mode, passing in the .env file
docker-compose --env-file backend/.env up

# Enter backend php server bash
docker exec -it ig-backend bash
    # - Generate the JWT secret used to sign the authentication token
    $ php artisan jwt:secret
    # - Migrate database
    $ php artisan migrate
    # Exit bash
    $ exit()
```

3. Go to `https://localhost:3000/`

</details>

<details>
    <summary>Run manually on your machine</summary>

1. Clone the repository

2. Navigate to `tccs-image-gallery/backend`

    1. Install the composer dependencies

    ```bash
    composer install
    ```

    2. Configure `.env`:

    ```bash
    # Copy the example .env file
    cp .env.example .env

    # Open the .env file
    nano .env

    # Edit with your configurations
    ...
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=imagegallery # or your own db name
    DB_USERNAME= # insert db username
    DB_PASSWORD= # insert db password

    # see https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys
    AWS_ACCESS_KEY_ID= # insert
    AWS_SECRET_ACCESS_KEY= # insert
    ...
    ```

    4. Set the JWTAuth secret key used to sign the tokens

    ```bash
    php artisan jwt:secret
    ```

    5. Run database migration

    ```bash
    php artisan migrate
    ```

    6. Serve the backend (API) to port `8000`

    ```bash
    composer serve
    ```

3. Navigate to `tccs-image-gallery/frontend`

    1. Install the node packages

    ```bash
    # Yarn
    yarn install
    ```

    2. Serve the frontend

    ```bash
    # Yarn
    yarn start
    ```

4. Go to `https://localhost:3000/`
 </details>

##### Application screenshots

|                       Login                        |                        Register                        |
| :------------------------------------------------: | :----------------------------------------------------: |
| ![Login as existing user](./docs/images/login.png) | ![Registering as new user](./docs/images/register.png) |

|              Home page               |
| :----------------------------------: |
| ![Home page](./docs/images/home.png) |

|                    Own Profile page                     |                        Other user profile page                        |
| :-----------------------------------------------------: | :-------------------------------------------------------------------: |
| ![Own profile page](./docs/images/view_own_profile.png) | ![Other user profile page](./docs/images/view_other_user_profile.png) |

|                     Create new gallery                      |
| :---------------------------------------------------------: |
| ![Create new gallery](./docs/images/create_new_gallery.png) |

|                    View own gallery                     |                        View other user gallery                        |
| :-----------------------------------------------------: | :-------------------------------------------------------------------: |
| ![Own profile page](./docs/images/view_own_gallery.png) | ![Other user gallery page](./docs/images/view_other_user_gallery.png) |

|                    Upload photos to gallery                     |                        View own gallery with photos                         |
| :-------------------------------------------------------------: | :-------------------------------------------------------------------------: |
| ![Upload photos on gallery](./docs/images/uploading_photos.png) | ![View gallery with photos](./docs/images/view_own_gallery_with_photos.png) |

|                   Preview photo                   |
| :-----------------------------------------------: |
| ![Preview photo](./docs/images/preview_photo.png) |

|                    Edit own gallery details                     |
| :-------------------------------------------------------------: |
| ![Edit own gallery details](./docs/images/edit_own_gallery.png) |

|                   Delete own gallery                    |              Deleting photo in gallery (with confirmation)              |
| :-----------------------------------------------------: | :---------------------------------------------------------------------: |
| ![Delete gallery](./docs/images/delete_own_gallery.png) | ![Delete photo in gallery](./docs/images/deleting_photo_in_gallery.png) |

|                   Browse to a non existing profile                   |
| :------------------------------------------------------------------: |
| ![Non-existing profile](./docs/images/view_non-existing_profile.png) |
