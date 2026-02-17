#!/bin/bash

# Resume Analyzer Database Setup Script
# This script automates the database creation process

set -e

echo "================================================"
echo "Resume Analyzer - Database Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
DB_NAME="resume_analyzer"
DB_USER="postgres"
DB_PASSWORD="postgres123"
DB_HOST="localhost"
DB_PORT="5432"

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if PostgreSQL is installed
check_postgres() {
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL is installed"
        return 0
    else
        print_error "PostgreSQL is not installed"
        return 1
    fi
}

# Check if Docker is installed
check_docker() {
    if command -v docker &> /dev/null; then
        print_success "Docker is installed"
        return 0
    else
        print_info "Docker is not installed"
        return 1
    fi
}

# Setup using Docker
setup_with_docker() {
    print_info "Setting up database using Docker..."
    
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found!"
        exit 1
    fi
    
    echo "Starting PostgreSQL and Redis containers..."
    docker-compose up -d postgres redis
    
    echo "Waiting for PostgreSQL to be ready..."
    sleep 5
    
    # Wait for PostgreSQL to be healthy
    until docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
        echo "Waiting for PostgreSQL..."
        sleep 2
    done
    
    print_success "Database setup complete!"
    print_info "PostgreSQL is running on port $DB_PORT"
    print_info "Redis is running on port 6379"
    print_info "pgAdmin is available at http://localhost:5050"
    print_info "  - Email: admin@resumeanalyzer.com"
    print_info "  - Password: admin123"
}

# Setup using local PostgreSQL
setup_with_local_postgres() {
    print_info "Setting up database using local PostgreSQL..."
    
    # Prompt for database credentials
    read -p "Enter database name [resume_analyzer]: " input_db_name
    DB_NAME=${input_db_name:-$DB_NAME}
    
    read -p "Enter database user [postgres]: " input_db_user
    DB_USER=${input_db_user:-$DB_USER}
    
    read -sp "Enter database password: " input_db_password
    echo ""
    DB_PASSWORD=${input_db_password:-$DB_PASSWORD}
    
    # Check if database exists
    if PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        print_info "Database '$DB_NAME' already exists"
        read -p "Do you want to drop and recreate it? (y/N): " confirm
        if [[ $confirm == [yY] ]]; then
            PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -c "DROP DATABASE $DB_NAME;"
            print_success "Dropped existing database"
        else
            print_info "Using existing database"
            return
        fi
    fi
    
    # Create database
    echo "Creating database '$DB_NAME'..."
    PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -c "CREATE DATABASE $DB_NAME;"
    print_success "Database created"
    
    # Run schema
    if [ -f "database/schema.sql" ]; then
        echo "Running schema.sql..."
        PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -f database/schema.sql
        print_success "Schema applied successfully"
    else
        print_error "database/schema.sql not found!"
        exit 1
    fi
    
    print_success "Database setup complete!"
}

# Update .env file
update_env_file() {
    print_info "Updating .env file..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Created .env from .env.example"
        else
            print_error ".env.example not found!"
            return
        fi
    fi
    
    # Update database configuration in .env
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME|g" .env
    sed -i.bak "s|DB_NAME=.*|DB_NAME=$DB_NAME|g" .env
    sed -i.bak "s|DB_USER=.*|DB_USER=$DB_USER|g" .env
    sed -i.bak "s|DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|g" .env
    
    print_success ".env file updated"
}

# Main menu
main() {
    echo "Choose setup method:"
    echo "1) Docker (Recommended - includes PostgreSQL, Redis, and pgAdmin)"
    echo "2) Local PostgreSQL installation"
    echo "3) Exit"
    echo ""
    read -p "Enter your choice [1-3]: " choice
    
    case $choice in
        1)
            if check_docker; then
                setup_with_docker
                update_env_file
            else
                print_error "Docker is required for this option"
                print_info "Install Docker from: https://docs.docker.com/get-docker/"
                exit 1
            fi
            ;;
        2)
            if check_postgres; then
                setup_with_local_postgres
                update_env_file
            else
                print_error "PostgreSQL is required for this option"
                print_info "Install PostgreSQL from: https://www.postgresql.org/download/"
                exit 1
            fi
            ;;
        3)
            print_info "Setup cancelled"
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    echo ""
    echo "================================================"
    print_success "Setup Complete!"
    echo "================================================"
    echo ""
    print_info "Next steps:"
    echo "  1. Review your .env file"
    echo "  2. Start the backend server: npm run dev"
    echo "  3. The application will connect to the database automatically"
    echo ""
}

# Run main function
main
