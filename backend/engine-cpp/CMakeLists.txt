cmake_minimum_required(VERSION 3.16)
project(hubflow_engine VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

find_package(Threads REQUIRED)

file(GLOB ENGINE_SOURCES ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp)

add_executable(hubflow_engine ${ENGINE_SOURCES})

target_include_directories(hubflow_engine PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include)
target_link_libraries(hubflow_engine PRIVATE Threads::Threads)

if(MSVC)
    target_compile_options(hubflow_engine PRIVATE /W4 /permissive-)
else()
    target_compile_options(hubflow_engine PRIVATE -Wall -Wextra -Wpedantic)
endif()

set_target_properties(hubflow_engine PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/bin)
