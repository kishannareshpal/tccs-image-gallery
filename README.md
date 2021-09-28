# tccs-image-gallery

### Getting Started

#### Notes

-   The database should be created before migration. The `.env` uses the `imagegallery` database by default. (as it is shown in step 2.2)
-   For storing photos the app uses the Amazon AWS S3 service. In order to get started, please:

    1. Sign in to the AWS S3 Console
    2. Create a bucket named `tccsimagegallery` in the `us-east-2` region and with `all` public access allowed.

-   The default PHP configurations from `php.ini` allows for a very small upload sizes. For the app, I would recommend updating the following settings:

    ```INI
    ; because the app upload allows for 10 files, 10MB max each.
    upload_max_filesize = 10M
    max_file_uploads = 10 ; at least
    post_max_size = 250M
    ```

 <hr>

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
