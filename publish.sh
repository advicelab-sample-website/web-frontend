#!/bin/bash

BUCKET_NAME="advicelab-web-prod"
REGION="ap-southeast-2"
INDEX_FILE="index.html"
ERROR_FILE="error.html"
FOLDER_PATH="./dist"
# PREFIX="www"
YOUR_DISTRIBUTION_ID="E1LOED90C0H8QD"

if ! command -v aws >/dev/null 2>&1; then
    echo "Error: AWS CLI is not installed."
    exit 1
fi

if ! aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "Error: Bucket $BUCKET_NAME does not exist or is not accessible."
    exit 1
fi

echo "Configuring S3 bucket for static website hosting..."

aws s3 website "s3://$BUCKET_NAME/" \
    --index-document "$INDEX_FILE" \
    --error-document "$ERROR_FILE"

if [ $? -ne 0 ]; then
    echo "Failed to configure S3 website hosting."
    exit 1
fi

echo "Uploading website files to S3 bucket..."

# aws s3 sync "$FOLDER_PATH" "s3://$BUCKET_NAME/$PREFIX/"
aws s3 sync "$FOLDER_PATH" "s3://$BUCKET_NAME/"

# # Remove objects from previous builds that are no longer present in dist.
# aws s3 sync "$FOLDER_PATH" "s3://$BUCKET_NAME/" --delete


if [ $? -ne 0 ]; then
    echo "Failed to upload files to S3."
    exit 1
fi

while IFS= read -r route_file; do
    route_key="${route_file#"$FOLDER_PATH/"}"
    route_key="${route_key%.html}"
    aws s3 cp "$route_file" "s3://$BUCKET_NAME/$route_key" \
        --content-type "text/html" \
        --cache-control "public, max-age=0, must-revalidate"

    if [ $? -ne 0 ]; then
        echo "Failed to upload prerendered route: $route_key"
        exit 1
    fi
done < <(find "$FOLDER_PATH" -type f -name "*.html" ! -name "index.html" ! -name "error.html")

echo "Creating CloudFront invalidation..."

aws cloudfront create-invalidation \
    --distribution-id "$YOUR_DISTRIBUTION_ID" \
    --paths "/*"

if [ $? -ne 0 ]; then
    echo "CloudFront invalidation failed."
    exit 1
fi

echo "Website deployed successfully!"