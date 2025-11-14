
import React from 'react';
import { StepCard } from './components/StepCard';
import { CodeBlock } from './components/CodeBlock';
import { HardwareIcon, SoftwareIcon, BrainIcon, CodeIcon, PlayIcon, GearIcon } from './components/Icons';

const App: React.FC = () => {

  const pythonTrainCode = `
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

# 1. Preparar los datos
# Organiza tus imágenes en carpetas: data/train/brick, data/train/plate, etc.
train_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

train_generator = train_datagen.flow_from_directory(
    'data/train',
    target_size=(150, 150),
    batch_size=20,
    class_mode='categorical',
    subset='training')

validation_generator = train_datagen.flow_from_directory(
    'data/train',
    target_size=(150, 150),
    batch_size=20,
    class_mode='categorical',
    subset='validation')

# 2. Construir el modelo (Red Neuronal Convolucional simple)
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(150, 150, 3)),
    MaxPooling2D(2, 2),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Flatten(),
    Dense(128, activation='relu'),
    Dense(len(train_generator.class_indices), activation='softmax') # Número de clases
])

# 3. Compilar y entrenar
model.compile(loss='categorical_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])

model.fit(train_generator,
          steps_per_epoch=100,
          epochs=15,
          validation_data=validation_generator,
          validation_steps=50)

# 4. Guardar el modelo para usarlo después
model.save('lego_classifier_model.h5')
`;

  const microPythonCode = `
from microbit import *
import servo

# Conecta el servo al pin S1 de la placa Wukong
s1 = servo.Servo(pin1)

while True:
    if uart.any():
        command = uart.read().decode().strip()
        
        # Mueve el servo a una posición según la pieza clasificada
        if command == 'brick':
            s1.write_angle(30)
            display.show(Image.SQUARE_SMALL)
        elif command == 'plate':
            s1.write_angle(90)
            display.show(Image.ASLEEP)
        elif command == 'tile':
            s1.write_angle(150)
            display.show(Image.HAPPY)
        
        sleep(1000)
        s1.write_angle(0) # Vuelve a la posición inicial
        display.clear()
`;

  const pythonMainCode = `
import cv2
import serial
import numpy as np
from tensorflow.keras.models import load_model

# Cargar el modelo de IA entrenado
model = load_model('lego_classifier_model.h5')
# Nombres de las clases (deben coincidir con el entrenamiento)
class_names = ['brick', 'plate', 'tile'] 

# Conexión con Micro:bit (ajusta el puerto COM)
ser = serial.Serial('COM3', 115200, timeout=1)

# Iniciar la cámara
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Muestra un recuadro donde poner la pieza
    cv2.rectangle(frame, (170, 85), (470, 385), (0, 255, 0), 2)
    cv2.imshow('Clasificador LEGO', frame)
    
    key = cv2.waitKey(1) & 0xFF
    if key == ord('c'): # Al presionar 'c', clasifica la pieza
        roi = frame[90:380, 175:465] # Región de interés
        img = cv2.resize(roi, (150, 150))
        img_array = np.expand_dims(img, axis=0) / 255.0

        # Predecir la clase de la pieza
        predictions = model.predict(img_array)
        predicted_class = class_names[np.argmax(predictions)]
        
        print(f'Pieza detectada: {predicted_class}')
        
        # Enviar comando al Micro:bit
        ser.write(predicted_class.encode())

    elif key == ord('q'): # Presiona 'q' para salir
        break

cap.release()
cv2.destroyAllWindows()
ser.close()
`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-2">
            Desafío Clasificador de LEGO con IA
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Un proyecto para construir un sistema inteligente que identifica y clasifica piezas de LEGO usando Micro:bit, una cámara y el poder de la Inteligencia Artificial.
          </p>
        </header>

        {/* Introduction / What you'll build */}
        <section className="mb-16">
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-6 md:p-8 border border-indigo-500/30">
                <div className="md:flex md:items-center md:gap-8">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-white mb-4">¿Qué construirás?</h2>
                        <p className="text-gray-300 mb-4">
                            Crearás un clasificador automatizado. El sistema capturará una imagen de una pieza de LEGO, un modelo de IA entrenado por ti decidirá qué tipo de pieza es (ladrillo, placa, etc.), y un Micro:bit con una placa Wukong activará un servo para moverla al contenedor correcto.
                        </p>
                        <p className="text-gray-300">
                           Es la combinación perfecta de hardware, software y machine learning.
                        </p>
                    </div>
                    <div className="md:w-1/2 mt-6 md:mt-0">
                        <img src="https://picsum.photos/seed/legoai/600/400" alt="LEGO Sorter Setup" className="rounded-lg shadow-lg w-full h-auto object-cover"/>
                        <p className="text-center text-xs text-gray-500 mt-2">Imaginación de un posible montaje.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Materials */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Materiales Necesarios</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-indigo-400"><HardwareIcon className="w-6 h-6 mr-2"/>Hardware</h3>
              <ul className="space-y-2 text-gray-300 list-disc list-inside">
                <li>BBC Micro:bit V2</li>
                <li>Placa de expansión Wukong</li>
                <li>Servo motor (ej. SG90)</li>
                <li>Cámara USB (Webcam)</li>
                <li>Piezas de LEGO de varias clases</li>
                <li>Estructura para montar todo (cartón, LEGOs, etc.)</li>
                <li>Buena iluminación (lámpara de escritorio)</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-indigo-400"><SoftwareIcon className="w-6 h-6 mr-2"/>Software</h3>
              <ul className="space-y-2 text-gray-300 list-disc list-inside">
                <li>Python 3.8+</li>
                <li>Editor de código (VS Code, Thonny)</li>
                <li>Bibliotecas: TensorFlow, OpenCV, PySerial</li>
                <li>Editor de MicroPython (Mu, MakeCode)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10 text-white">El Desafío: Paso a Paso</h2>
          <div className="space-y-8">
            <StepCard 
              stepNumber={1} 
              title="Montaje del Hardware" 
              icon={<GearIcon/>}
              description="Construye tu estación de clasificación. Necesitas un soporte para la cámara que apunte hacia abajo, un área designada para colocar cada pieza de LEGO, y el servo motor posicionado para desviar las piezas a diferentes contenedores. ¡Usa tu creatividad!"
              imageUrl="https://picsum.photos/seed/legosetup/500/300"
            />
            <StepCard 
              stepNumber={2} 
              title="Recolección de Datos" 
              icon={<PlayIcon/>}
              description="¡La IA necesita aprender! Toma muchas fotos de cada tipo de pieza de LEGO que quieras clasificar (ej. 50-100 fotos por clase). Asegura una buena iluminación y varía ligeramente la posición y rotación de las piezas. Organiza las imágenes en carpetas con el nombre de cada clase (ej. 'ladrillo_2x4', 'placa_2x2')."
              imageUrl="https://picsum.photos/seed/legodata/500/300"
            />
            <StepCard 
              stepNumber={3} 
              title="Entrenamiento del Modelo de IA" 
              icon={<BrainIcon/>}
              description="Aquí es donde ocurre la magia. Usaremos Python y TensorFlow/Keras para entrenar un modelo de clasificación de imágenes. Este script cargará tus imágenes, aprenderá a diferenciar las clases y guardará el 'cerebro' de nuestra operación en un archivo."
            >
                <CodeBlock language="python" code={pythonTrainCode} />
            </StepCard>

            <StepCard 
              stepNumber={4} 
              title="Programación del Micro:bit" 
              icon={<CodeIcon/>}
              description="El Micro:bit será el músculo del sistema. Lo programaremos con MicroPython para que escuche comandos a través de la conexión USB (UART). Cuando reciba un comando (como 'brick' o 'plate'), moverá el servo a la posición correcta para clasificar la pieza."
            >
                <CodeBlock language="python" code={microPythonCode} />
            </StepCard>
            
            <StepCard 
              stepNumber={5} 
              title="Integración y Puesta en Marcha" 
              icon={<PlayIcon/>}
              description="Este script principal de Python une todo. Activa la cámara, espera a que presiones una tecla para capturar y clasificar una pieza, envía el resultado al modelo de IA y comunica la decisión final al Micro:bit para que actúe. ¡Es el director de orquesta de tu proyecto!"
            >
                <CodeBlock language="python" code={pythonMainCode} />
            </StepCard>
          </div>
        </section>

        {/* Conclusion */}
         <section className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">¡Desafío Completado y Próximos Pasos!</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                ¡Felicidades! Has construido un sistema de clasificación inteligente. Ahora puedes expandirlo: añade más clases de piezas, mejora la precisión del modelo o automatiza completamente el proceso con una cinta transportadora. ¡El único límite es tu imaginación!
            </p>
        </section>

      </main>
    </div>
  );
}

export default App;
