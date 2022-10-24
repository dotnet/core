# Use microsoft/dotnet:2.1-aspnetcore-runtime-stretch-slim 
# from public Docker registry as base image.   
# Alias the image as base  
FROM microsoft/dotnet:2.1-aspnetcore-runtime-stretch-slim AS base  
# Set /app as working directory.  
WORKDIR /app  
# Expose port 80 on Image.  
EXPOSE 80  
# Expose port 443 on Image.  
EXPOSE 443  
# Use microsoft/dotnet:2.1-sdk-stretch from public Docker registry 
# as build image. 
# Application will be built on this image.   
# Alias the image as build.   
FROM microsoft/dotnet:2.1-sdk-stretch AS build  
# Set working directory as /src  
WORKDIR /src  
# Copy from LinuxAppForContainer/LinuxAppForContainer.csproj 
# on local disk where Docker file is present   
# to Image folder LinuxAppForContainer in /src folder  
COPY ["LinuxAppForContainer/LinuxAppForContainer.csproj", "LinuxAppForContainer/"]  
# Restore tools and packages for the solution on the local disk  
RUN dotnet restore "LinuxAppForContainer/LinuxAppForContainer.csproj"  
# Copy all files/folders recursively from current folder where the docker 
# file is present on local directory to /src   
COPY . .  
# et working directory as /src/LinuxAppForContainer  
WORKDIR "/src/LinuxAppForContainer"  
# Build solution in Release mode and place it in /app folder  
RUN dotnet build "LinuxAppForContainer.csproj" -c Release -o /app  
# Publish build to /app folder and alias build as publish  
FROM build AS publish  
RUN dotnet publish "LinuxAppForContainer.csproj" -c Release -o /app  
 
# Prepare the final base image. Copy /app from image named as publish to base 
# image /app directory and alias it final  
FROM base AS final  
WORKDIR /app  
COPY --from=publish /app .  
ENTRYPOINT ["dotnet", "LinuxAppForContainer.dll"]  
