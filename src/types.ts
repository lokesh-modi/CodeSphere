export interface Language {
  id: string;
  name: string;
  icon: string;
  jdoodleCode: string;
  versionIndex: string;
  defaultCode: string;
  fileExtension: string;
}

export const LANGUAGES: Language[] = [
  {
    id: 'python',
    name: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    jdoodleCode: 'python3',
    versionIndex: '3',
    fileExtension: 'py',
    defaultCode: `print("Hello, World!")`,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    jdoodleCode: 'nodejs',
    versionIndex: '4',
    fileExtension: 'js',
    defaultCode: `console.log("Hello, World!");`,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    jdoodleCode: 'nodejs',
    versionIndex: '4',
    fileExtension: 'ts',
    defaultCode: `console.log("Hello, World!");`,
  },
  {
    id: 'java',
    name: 'Java',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    jdoodleCode: 'java',
    versionIndex: '4',
    fileExtension: 'java',
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
  {
    id: 'c',
    name: 'C',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    jdoodleCode: 'c',
    versionIndex: '5',
    fileExtension: 'c',
    defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    jdoodleCode: 'cpp17',
    versionIndex: '0',
    fileExtension: 'cpp',
    defaultCode: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
  },
  {
    id: 'csharp',
    name: 'C#',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
    jdoodleCode: 'csharp',
    versionIndex: '4',
    fileExtension: 'cs',
    defaultCode: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
  },
  {
    id: 'go',
    name: 'Go',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
    jdoodleCode: 'go',
    versionIndex: '3',
    fileExtension: 'go',
    defaultCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  },
  {
    id: 'php',
    name: 'PHP',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    jdoodleCode: 'php',
    versionIndex: '3',
    fileExtension: 'php',
    defaultCode: `<?php
echo "Hello, World!\\n";
?>`,
  },
  {
    id: 'ruby',
    name: 'Ruby',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
    jdoodleCode: 'ruby',
    versionIndex: '4',
    fileExtension: 'rb',
    defaultCode: `puts "Hello, World!"`,
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
    jdoodleCode: 'kotlin',
    versionIndex: '3',
    fileExtension: 'kt',
    defaultCode: `fun main() {
    println("Hello, World!")
}`,
  },
  {
    id: 'swift',
    name: 'Swift',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
    jdoodleCode: 'swift',
    versionIndex: '5',
    fileExtension: 'swift',
    defaultCode: `print("Hello, World!")`,
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
    jdoodleCode: 'rust',
    versionIndex: '3',
    fileExtension: 'rs',
    defaultCode: `fn main() {
    println!("Hello, World!");
}`,
  },
  {
    id: 'r',
    name: 'R',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg',
    jdoodleCode: 'r',
    versionIndex: '4',
    fileExtension: 'r',
    defaultCode: `print("Hello, World!")`,
  },
  {
    id: 'sql',
    name: 'SQL',
    icon: '/database.png',  // Using PostgreSQL as a stand-in for SQLdatabase.png
    jdoodleCode: 'sql',
    versionIndex: '4',
    fileExtension: 'sql',
    defaultCode: `SELECT 'Hello, World!' AS message;`,
  },
];