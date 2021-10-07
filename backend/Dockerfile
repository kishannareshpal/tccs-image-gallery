FROM php:7.4-fpm

COPY composer.json /var/www/composer.json
COPY composer.lock /var/www/composer.lock

WORKDIR /backend

# Install system dependencies
RUN apt-get update
RUN apt-get install -y build-essential \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg62-turbo-dev \
    jpegoptim optipng pngquant gifsicle \
    vim \
    libonig-dev \
    libfreetype6-dev \
    libxml2-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy backed contents
COPY . .

# Expose port 8000
EXPOSE 8000

CMD [ "composer", "serve" ]
