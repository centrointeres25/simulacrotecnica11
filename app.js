// app.js — Simulacro Saber 11 2025 — Versión limpia
import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, getDocs, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const FB = {
  apiKey:"AIzaSyBP5uJiq8oteVr9aRog5CVJEEPhDEKmEi0",
  authDomain:"saber11-simulacro.firebaseapp.com",
  projectId:"saber11-simulacro",
  storageBucket:"saber11-simulacro.firebasestorage.app",
  messagingSenderId:"200980492866",
  appId:"1:200980492866:web:2c643ac5116cbfd967f3db"
};
const ADMIN_U = "admin", ADMIN_P = "admin";

const fbApp = initializeApp(FB);
const auth  = getAuth(fbApp);
const db    = getFirestore(fbApp);
const prov  = new GoogleAuthProvider();

// ── MATERIAS
const MATS = {
  matematicas:{ n:"Matemáticas",          c:"#2563eb", e:"🔢", r:[1,25]  },
  lectura:    { n:"Lectura Crítica",       c:"#7c3aed", e:"📖", r:[26,66] },
  sociales:   { n:"Sociales y Ciudadanas", c:"#059669", e:"🌎", r:[67,91] },
  naturales:  { n:"Ciencias Naturales",    c:"#dc2626", e:"🔬", r:[92,120]}
};

// ── RESPUESTAS
const QA = {
  1:{r:"C",e:"Se suman las edades de las siete madres: 21 + 26 + 20 + 21 + 22 + 28 + 30 = 168. Luego se divide entre 7 (número de datos): 168 ÷ 7 = 24. El promedio de las edades es 24 años."},
  2:{r:"B",e:"La fórmula dada es: Valor total = (5 × $80.000 + 2 × $150.000)(1 + y), donde y es el porcentaje del impuesto. El problema indica que el impuesto puede ser 12% o 19% según la temporada del año. Como el enunciado no especifica cuál es la temporada, no "},
  3:{r:"C",e:"Al sumar todas las regiones del diagrama de Venn: 10 + 8 + 5 + 6 + 1 + 15 + 15 = 60 pacientes tratados en total. Al sumar las frecuencias de la tabla: 24 + 22 + 14 = 60. Ambos valores coinciden con el número total de pacientes (60), lo que valida la "},
  4:{r:"D",e:"Para que haya \'al menos un hombre\' en el grupo, se deben considerar: Grupo 2 (una mujer y dos hombres → Y combinaciones) y Grupo 3 (dos mujeres y un hombre → Z combinaciones). El Grupo 1 (tres hombres) es imposible ya que solo hay 2 hombres, por lo q"},
  5:{r:"B",e:"Se multiplica la cantidad de premios por el monto de cada uno: Oro: 5 × $10.000.000 = $50.000.000. Plata: 25 × $5.000.000 = $125.000.000. Bronce: 100 × $1.000.000 = $100.000.000. La tabla B refleja correctamente estos totales."},
  6:{r:"C",e:"Paso 1: $750.000 ÷ $50.000 = 15. Paso 2: Se busca x tal que 2⁰ + 2¹ + 2² + 2³ = 1 + 2 + 4 + 8 = 15, entonces x = 3. Paso 3: Se suma 1 al valor de x: 3 + 1 = 4 meses. La familia necesita ahorrar durante 4 meses para completar los $750.000."},
  7:{r:"B",e:"Siguiendo la estrategia de Alberto: el sueldo de Estefanía es $900.000 → 9 × 3 = 27. Luego, 900.000 tiene 5 ceros pero se consideran 3, formando el factor 1.000. Ahorro mensual: 27 × 1.000 = $27.000. En 10 meses: $27.000 × 10 = $270.000."},
  8:{r:"C",e:"Comparando los valores: en la gráfica, Antioquia en 2012 muestra 20,5 (tabla: 21,7) y en 2013 muestra 18,3 (tabla: 22,4). Además, Bogotá D.C. en 2015 muestra un valor diferente en la gráfica respecto a la tabla (4,7). Estas discrepancias muestran que"},
  9:{r:"D",e:"Los datos de la distribución de las 2.000 papas son: [15–20): 700 papas (35%), [20–25): 500 papas (25%), [25–30): 800 papas (40%). La gráfica correcta debe ser un histograma o gráfico de barras con \'Intervalo\' en el eje x y \'Cantidad de papas\' en el "},
  10:{r:"C",e:"La encuesta llama a 1.000 personas de un solo municipio elegido aleatoriamente dentro del departamento. Como el departamento tiene muchos municipios, la muestra solo representa a ese municipio en particular, no a toda la población departamental. Esta"},
  11:{r:"B",e:"La torta tiene 60 cm de base y 20 cm de altura. Según la figura, el trozo número 1 (ubicado en la parte superior derecha) tiene dimensiones de 15 cm de ancho y 10 cm de alto. Su área es: 15 cm × 10 cm = 150 cm²."},
  12:{r:"C",e:"Los pedidos están en unidades distintas: Pedido 1 en kg, Pedido 2 en kg, y Pedido 3 en toneladas. Para sumar magnitudes, deben estar en la misma unidad. El empleado sumó 500 + 200 + 1 obteniendo \'701 ton\', lo cual es incorrecto porque mezcló kg con t"},
  13:{r:"C",e:"La región 1 tiene forma triangular con base 4 m y altura 3 m. El área de un triángulo es (base × altura) ÷ 2 = (4 × 3) ÷ 2 = 6 m². El pintor calculó solo 4 × 3 = 12 m² sin dividir entre 2, lo que duplica el área real. El error está en el paso 2: falt"},
  14:{r:"C",e:"La tabla muestra valores absolutos de votos (2.000, 5.000, etc.). La gráfica circular (pie chart) solo muestra proporciones/porcentajes relativos. Sin conocer el total de votos, es imposible obtener los valores exactos de la tabla a partir de la gráf"},
  15:{r:"B",e:"Observando el dinero ahorrado al finalizar cada mes: Enero: $130.000, Febrero: $160.000, Marzo: $190.000, Abril: $220.000. La diferencia entre meses consecutivos es siempre $30.000 ($160.000 – $130.000 = $30.000, $190.000 – $160.000 = $30.000, etc.)."},
  16:{r:"B",e:"El promedio del número de piezas reemplazadas se calcula sumando los valores y dividiendo entre el número de vehículos: (6 + 5 + 10) ÷ 3 = 21 ÷ 3 = 7 piezas promedio."},
  17:{r:"D",e:"Para conocer el total de personas que se transportan en bicicleta, se deben sumar todas las regiones del diagrama de Venn que incluyen la bicicleta: solo bicicleta (50) + bicicleta y carro (20) + bicicleta y transporte público (25) + los tres medios "},
  18:{r:"D",e:"El número se duplica cada 2 años. Partiendo de 10.000 en 2010: 2010: 10.000 → 2012: 20.000 → 2014: 40.000 → 2016: 80.000 transistores. En 6 años (3 duplicaciones), el número es 10.000 × 2³ = 10.000 × 8 = 80.000."},
  19:{r:"A",e:"El procedimiento calcula el área de un triángulo sombreado (paso 1: base × altura, paso 2: ÷ 2) y luego multiplica por 4 (paso 3) para obtener el área de los 4 triángulos. El paso 4 dice \'sumar 4 veces el resultado del paso 2\', lo cual produce exacta"},
  20:{r:"A",e:"La expresión original es: (10 m/s)(15s) + ½(3 m/s²)(15s)². Al factorizar 15s: 15s × [10 m/s + ½(3 m/s²)(15s)] = 15s × [10 + 22,5] m/s = 487,5 m. La persona factorizó correctamente el tiempo (15 s) como factor común de los dos términos, lo cual es una"},
  21:{r:"B",e:"Para calcular el tiempo de descarga: Tiempo = Tamaño (KB) ÷ Velocidad (KB/s). El tamaño en KB = 12,6 MB × 1.024 KB/MB = 12.902,4 KB. Velocidad = 300 KB/s. Tiempo = 12.902,4 ÷ 300 ≈ 43 s. El procedimiento B calcula primero 1.024 × 300 = 307.200, y lue"},
  22:{r:"C",e:"La rampa va desde 3 m de altura (en la pared) hasta 0 m a 4 m de distancia. La columna está a 2 m de la pared (y también a 2 m del extremo). Por triángulos semejantes: h/3 = (4–2)/4 → h = 3×(2/4) = 1,5 m. El procedimiento C usa: 4÷2 = 2, luego 3÷2 = "},
  23:{r:"A",e:"En coordenadas polares (r, θ), r es la distancia al polo (torre de control). Comparando las distancias: W = 20 km (más cercano), V = 30 km, Y = 40 km, X = 60 km (más lejano). El orden de más cerca a más lejos es: W, V, Y, X."},
  24:{r:"C",e:"Siguiendo la ruta de Kevin desde la farmacia: avanza 3 cuadras (primer pedido), avanza el doble = 6 cuadras (segundo pedido), avanza la mitad de las anteriores = 3 cuadras (tercer pedido), regresa 10 cuadras (cuarto pedido), avanza 1 cuadra (llega a "},
  25:{r:"C",e:"Se ordenan las presiones de menor a mayor (más negativa a menos negativa): Mariana: –7,62 (la más baja, primera en recibir tratamiento), Santiago: –7,60, Orlando: –7,53, Ximena: –7,09 (la menos negativa, última). La opción C refleja este orden correc"},
  26:{r:"D",e:"El segundo párrafo presenta dos razones de Epicuro: (1) todos los seres vivos, por instinto y desde su nacimiento, buscan el placer y rechazan el dolor; (2) los sentimientos de placer y dolor son criterios esenciales de decisión y conducta, pues son "},
  27:{r:"D",e:"El primer enunciado afirma que la filosofía epicúrea tiene una finalidad ética porque pretende guiarnos hacia la buena vida. El segundo enunciado explica qué entiende el epicureísmo por \'buena vida\' (la vida placentera cuyo fin es conseguir placer y "},
  28:{r:"A",e:"El fragmento señala que el placer y el dolor son \'eventos reales que no pueden ser refutados\' y que son evidentes (no podemos dudar de que sentimos dolor ante un golpe). Al ser reales e inevitables, sirven como criterios de decisión y conducta, lo qu"},
  29:{r:"B",e:"El fragmento del texto sostiene que la tendencia natural e instintiva de buscar placer y evitar dolor es el criterio ético más fundamental. La cita de Darwin establece que tanto los humanos como los animales comparten esta capacidad natural de sentir"},
  30:{r:"C",e:"La pregunta retórica \'¿cómo podría ser falsa la sensación de dolor ante un golpe?\' no busca una respuesta, sino reforzar la afirmación anterior: el dolor es un hecho real que no puede cuestionarse. Su función es afirmar con énfasis que la experiencia"},
  31:{r:"A",e:"El tercer párrafo contrasta la educación sofista (finalidad práctica: aprender a argumentar y persuadir) con los modelos anteriores que buscaban \'alcanzar y descubrir la verdad\'. Al hacer esta distinción, el texto presupone que la búsqueda de la verd"},
  32:{r:"B",e:"La afirmación 1 sostiene un relativismo epistemológico (todo depende del punto de vista). La afirmación 2 es nihilista/escéptica radical (nada existe). El relativismo (1) no implica necesariamente el nihilismo (2): que la verdad dependa de perspectiv"},
  33:{r:"A",e:"\'Deslumbrar\' significa impresionar fuertemente, causar admiración intensa (como la luz que ciega). \'Encandilar\' tiene el mismo sentido: deslumbrar, fascinar, impresionar de manera que \'cega\' la razón. Es el sinónimo más preciso en este contexto, dond"},
  34:{r:"A",e:"El fragmento abre el texto de \'Ética para Amador\' presentando la idea central que el autor defenderá: no se trata solo de tener una buena vida (como la de una coliflor o un escarabajo), sino de tener una buena vida humana. Este fragmento introductori"},
  35:{r:"D",e:"Savater presenta el tema (qué es la buena vida), expone su tesis (la buena vida humana requiere relaciones con otros), y la defiende con ejemplos concretos sobre el dinero, la ropa, la casa, haciendo preguntas retóricas que conducen al lector hacia s"},
  36:{r:"B",e:"\'Casi todas las sociedades humanas conocidas han tenido música, lo que sugiere que nuestra apreciación por ella es innata.\' El pronombre relativo \'lo que\' conecta la evidencia (todas las sociedades tienen música) con la conclusión que se infiere de e"},
  37:{r:"C",e:"El texto describe la evolución histórica: los antepasados tocaban flautas de hueso y percusiones, luego los instrumentos se diversificaron pasando por madera, cuerda y metal (donde entra la trompeta), hasta llegar a las guitarras eléctricas. La tromp"},
  38:{r:"D",e:"En el texto, los bebés de dos meses voltean cuando escuchan sonidos agradables y le dan la espalda a \'los disonantes\'. En el contexto de la percepción musical infantil, \'disonantes\' son los sonidos que resultan desagradables al oído, en contraposició"},
  39:{r:"B",e:"El fragmento es la primera oración del texto y establece el tema central: la relación antiquísima (más de 40.000 años) entre los humanos y la música. Su función es presentar el asunto principal que el texto desarrollará."},
  40:{r:"C",e:"El autor compara la afición por la literatura con la \'solitaria\' (tenia): un parásito que se instala en el organismo, se alimenta de él y lo domina. Esta analogía/comparación entre el escritor y el enfermo de solitaria es la estrategia retórica usada"},
  41:{r:"B",e:"El texto explica directamente cómo actúa la solitaria: \'Una vez que la solitaria se instala en el organismo se consubstancia con él, se alimenta de él, crece y se fortalece a expensas de él\'. Esta es la descripción precisa del mecanismo de actuación "},
  42:{r:"B",e:"José María confiesa que todas sus actividades (cine, exposiciones, librerías) las hace \'para ella, la solitaria\', y que ya no vive para sí mismo sino para ese ser que lleva adentro, \'del que ya no soy más que un sirviente\'. Este fragmento caracteriza"},
  43:{r:"C",e:"La comparación \'hacen efervescencia como champaña\' significa que las burbujas explotan y liberan su contenido (partículas) hacia el ambiente, de la misma manera que las burbujas de champaña estallan y liberan gas CO₂. La equivalencia está en el proce"},
  44:{r:"D",e:"El último cuadro presenta el resultado final del proceso descrito: \'el conjunto de partículas es lo que produce ese olor llamado petricor\'. Este cierre resume el propósito del texto (explicar el origen del olor a lluvia) y concluye el proceso narrado"},
  45:{r:"C",e:"La \'o\' conecta: \'ese olor llamado petricor\' con \'como lo conoces tú: tierra mojada\'. Ambas expresiones se refieren al mismo fenómeno con nombres diferentes. La \'o\' no indica oposición ni causa-efecto, sino que ofrece una alternativa de denominación ("},
  46:{r:"D",e:"La infografía del petricor describe el fenómeno mostrando etapas secuenciales: las gotas forman burbujas → las burbujas atrapan partículas → las burbujas hacen efervescencia → las partículas se esparcen → producen el olor. La estrategia es explicar u"},
  47:{r:"B",e:"El texto de Téllez defiende que la infancia representa \'la única certeza de sinceridad\'. Los niños \'aman y detestan integral, honda y sinceramente con diáfana lealtad\', expresan sus emociones con plena claridad sin hipocresía ni disimulo. La tesis ce"},
  48:{r:"B",e:"El texto presenta la tesis (los niños son sinceros, los adultos aprenden a mentir) y la defiende acumulando ejemplos concretos de la honestidad infantil: cómo aman y detestan con diáfana lealtad, cómo expresan su amor o desamor sin razones añadidas, "},
  49:{r:"B",e:"El cómic se basa en la obra \'El árabe del futuro 4\' y menciona explícitamente el Corán (en la nota a pie de página: \'Corán: Libro sagrado para los musulmanes\'). El texto árabe dividido en versículos que la maestra enseña corresponde al Corán, que es "},
  50:{r:"C",e:"En el sexto cuadro, el globo contiene las palabras árabes que recita la mujer (\'Bismilá arramán arrahím\'), mientras que el texto en cursiva debajo de la flecha dice \'Escucharla era muy agradable\'. Este texto en cursiva expresa el gusto o la reacción "},
  51:{r:"D",e:"Los rectángulos de texto en la parte superior de los cuadros 1, 3, 4 y 6 narran la experiencia desde la perspectiva de la protagonista: \'El director de la escuela y mi padre creían...\', \'Así que me obligaron...\', \'Yo me preguntaba si...\'. Estas narra"},
  52:{r:"D",e:"La predicción 1 (el Papa Francisco sufrirá una grave enfermedad) es específica y, según el texto, fallida en ese aspecto. La predicción 2 (en el mundo habrá más refugiados) es general y, según el texto, acertó. Estas dos predicciones ilustran funcion"},
  53:{r:"A",e:"El experimento de Forer entregó a todos los estudiantes la misma descripción (que decía tener \'gran necesidad de aprecio\', \'compensar debilidades\', etc.), y todos la valoraron altamente como descripción precisa de sí mismos. Esto evidencia que las pe"},
  54:{r:"B",e:"El texto dice: \'El tren se detuvo en el interior del bosque\' y las negociaciones ocurrieron en \'un antiguo coche-cama francés\'. El vagón pertenecía al mariscal Foch, comandante supremo de las fuerzas aliadas, y estaba en territorio bajo control aliad"},
  55:{r:"B",e:"Los alemanes \'quedaron aturdidos, comprendiendo por primera vez la magnitud de su derrota\'. Habían ido a negociar una tregua sin saber que serían ellos quienes debían pedir condiciones de rendición. Estaban derrotados pero no comprendían plenamente s"},
  56:{r:"B",e:"El texto presenta a Erzberger como \'portavoz del grupo\' alemán que llegó a recibir las propuestas aliadas para una tregua. Fue enviado a negociar con el mariscal Foch, el \'supremo comandante de las fuerzas aliadas\'. Su rol es el de un representante d"},
  57:{r:"C",e:"El texto principal dice que la intransigencia de Foch y el destino de Erzberger son ejemplos de las fuerzas que condujeron a la Segunda Guerra Mundial. El fragmento adicional (Churchill) complementa esto mostrando que el Tratado de Versalles dejó a A"},
  58:{r:"D",e:"El primer enunciado afirma que la extinción es un proceso evolutivo natural. La pregunta retórica del segundo enunciado (\'¿Por qué hay que preocuparse si se está ayudando a la naturaleza?\') refuerza esta misma idea. No hay contradicción ni duda: ambo"},
  59:{r:"C",e:"La cita de Los Simpson presenta el argumento anti-conservacionista de forma exagerada e irónica (Burns se queja de que \'la naturaleza quiere renunciar porque está perdiendo\'). Esta caricaturización ridiculiza el argumento de que la extinción es natur"},
  60:{r:"C",e:"En el contexto \'diseñar un computador que sea obedientemente útil y, al mismo tiempo, inmune a la infección\', \'inmune\' significa que no puede ser afectado o atacado por infecciones. El sinónimo más preciso es \'invulnerable\', que significa imposible d"},
  61:{r:"C",e:"La comparación con los soldados ilustra que estos obedecen órdenes sin evaluar si son correctas o incorrectas. El autor usa esta analogía para decir que los computadores hacen exactamente lo mismo: ejecutan cualquier instrucción sin ningún juicio sob"},
  62:{r:"C",e:"El enunciado 2 establece el principio general: la obediencia incuestionable hace que los computadores sean útiles PERO vulnerables. El enunciado 1 es un ejemplo concreto de esta vulnerabilidad: un programa malicioso que diga \'cópiame\' será obedecido "},
  63:{r:"B",e:"El texto gira en torno al rasgo central de los computadores (la obediencia ciega a instrucciones) y sus implicaciones: les permite ser útiles y al mismo tiempo los hace vulnerables a infecciones. La pregunta que mejor captura este enfoque del texto e"},
  64:{r:"B",e:"El texto dice que un programa malicioso que diga \'cópiame y envíame a todas las direcciones que puedas encontrar en el disco duro\' será \'simplemente obedecido y vuelto a obedecer por los demás computadores\'. Si su computador es infectado, lo primero "},
  65:{r:"B",e:"El texto explica: \'la pequeñez de las partes constituía un gran obstáculo para la rapidez de mi trabajo, decidí... hacer un ser de estatura gigantesca\'. La razón principal es que trabajar con partes pequeñas era lento y dificultoso; hacer un ser gran"},
  66:{r:"B",e:"La frase \'parecía haber perdido por completo el alma y la sensibilidad salvo para este objetivo\' expresa el estado emocional del narrador durante la creación: estaba completamente obsesionado, sin sensibilidad para nada más. No es una afirmación ni u"},
  67:{r:"D",e:"En 1811, Colombia estaba en guerra de independencia: Nariño rechazaba el federalismo porque dividía las fuerzas necesarias para enfrentar a España. En 1823, con la independencia prácticamente ganada, el federalismo se convirtió en el sistema más adec"},
  68:{r:"B",e:"La dimensión cultural: la cosmovisión indígena da valor espiritual al jaguar. La dimensión jurisdiccional: ¿puede la autoridad indígena sancionar a alguien que no es miembro de su comunidad? Pedro cuestiona que las normas de un cabildo indígena le se"},
  69:{r:"A",e:"El periodista argumenta que puede publicar sin verificar gracias a la libertad de prensa. La opción A contradice esto al afirmar que la libertad de prensa solo protege la divulgación de información veraz e imparcial. Publicar sin verificar las fuente"},
  70:{r:"D",e:"La dimensión económica está presente en: \'generar grandes ingresos, brindar empleo y llevar electricidad\'. La dimensión ambiental aparece en: \'intervenciones en el río Omo\' y \'podría acabar con miles de animales y plantas nativas\'. No se mencionan ex"},
  71:{r:"D",e:"El fragmento B describe al presidente hablando \'por segunda vez en 48 horas\', lo que indica una respuesta urgente e inmediata a los atentados. El fragmento A describe acciones como \'aprobando nuevas leyes y reforzando la seguridad\', que son procesos "},
  72:{r:"C",e:"Si se implementa la erradicación manual, la fuerza pública erradicaría los cultivos directamente. Los campesinos obligados por los GAO a cultivar coca se verían afectados por esta medida. Según el texto, no está contemplado judicializarlos, pero la d"},
  73:{r:"C",e:"El clientelismo implica que gobernantes intercambian bienes/servicios o trato privilegiado por apoyo político. Esta práctica justifica la existencia de entes de control porque, sin supervisión, los gobernantes aprovechan su posición para obtener voto"},
  74:{r:"C",e:"El texto explica que la Corte Constitucional buscó \'responder a los nuevos patrones en la conformación de las familias en el país\'. Las normas jurídicas deben adaptarse a las realidades sociales cambiantes para garantizar los derechos de todos y faci"},
  75:{r:"B",e:"La situación describe contaminación del río (única fuente de agua) por la minería. Una regulación permitiría conciliar el derecho a la salud y al agua limpia de los habitantes con el derecho al trabajo de los mineros, estableciendo estándares que pro"},
  76:{r:"A",e:"El Manifiesto Comunista fue escrito por Marx y Engels en 1848, es decir, en el siglo XIX. El texto mismo menciona \'todas las fuerzas de la vieja Europa\' y el contexto de las potencias europeas, lo que sitúa su escritura en el contexto del capitalismo"},
  77:{r:"A",e:"La definición de POT establece que los recursos de la comunidad \'se empleen eficientemente y de manera sostenible\' y busca \'el desarrollo más equitativo posible\'. Estos dos conceptos (equitativo y sustentable/sostenible) son los que mejor resumen la "},
  78:{r:"C",e:"Las condiciones necesarias para implementar la energía eólica incluyen: convencer a la población del beneficio, que no les incomode el impacto visual, y que la capacidad de producción sea suficiente. La reforestación es una consecuencia DESEABLE pero"},
  79:{r:"A",e:"El político recomienda \'tener mucho cuidado al momento de relacionarse en la calle con cualquier persona que parezca tener un acento del país vecino\'. Esto genera una predisposición negativa hacia todos los inmigrantes, independientemente de si son o"},
  80:{r:"D",e:"Las 5 condiciones propuestas buscan: calendario electoral estable, controles independientes, no represalias por voto, libertad de partidos, y respeto de resultados. Todas estas medidas apuntan a fortalecer la democracia representativa y garantizar qu"},
  81:{r:"B",e:"Los gremios minero y petrolero quieren explotar la selva amazónica. Los pueblos indígenas aislados voluntariamente buscan protección de su territorio. Estos intereses son directamente opuestos, pues la explotación minera implicaría contacto con los p"},
  82:{r:"A",e:"La propuesta del Ministerio de Minas asume que los gremios actuarán dentro del marco legal al negociar. No considera la posibilidad de que su interés sea únicamente la extracción ilegal de recursos. Esta reacción NO fue contemplada en la propuesta."},
  83:{r:"C",e:"La dimensión económica: los mercados campesinos permiten vender sin intermediarios a mejores precios, mejorando los ingresos. La dimensión cultural: se rescata una tradición ancestral (los mercados campesinos) y prácticas olvidadas relacionadas con e"},
  84:{r:"B",e:"El texto dice que \'el Gobierno nacional le comunica que, si se considera el diseño entregado por los ingenieros, no habrá dinero suficiente para ejecutar la obra\'. El obstáculo principal es económico: el diseño es más costoso de lo que el presupuesto"},
  85:{r:"D",e:"Gracias al acuerdo de paz, el rol del ejército cambió: en lugar de combatir al grupo armado, ahora lo custodia durante su transición a la vida civil. Este cambio de función se explica porque el contexto sociopolítico del país es diferente: hay un pro"},
  86:{r:"B",e:"Las afirmaciones del presidente sobre el cambio climático en redes sociales no son confiables porque provienen de alguien con intereses económicos. Un presidente escéptico del cambio climático podría tener razones para no apoyar acuerdos ambientales "},
  87:{r:"B",e:"La teoría de la dependencia describe que los países del norte (desarrollados) obtienen materias primas baratas de los del sur (en desarrollo), las procesan, y venden productos terminados de mayor valor. La opción B refleja exactamente esta dinámica: "},
  88:{r:"C",e:"La ONU define el desarrollo sostenible como el equilibrio entre desarrollo económico, desarrollo social y protección del medio ambiente. Una política económica es sostenible cuando no sacrifica la protección ambiental en favor del crecimiento económi"},
  89:{r:"D",e:"Según Smith, la división del trabajo hace que cada persona produzca lo que mejor sabe hacer. El mercado permite luego el intercambio de estos bienes especializados, distribuyéndolos eficientemente entre quienes los necesitan. El mercado es el mecanis"},
  90:{r:"C",e:"El artículo describe al pez león como una amenaza para las especies nativas al alimentarse de peces jóvenes (como el pargo y el mero). Esta información es útil para investigar cómo la presencia del pez león ha reducido la biodiversidad marina en el C"},
  91:{r:"C",e:"La Constitución Política de Colombia prevé mecanismos de participación ciudadana como el referendo, que permite a los ciudadanos proponer y votar cambios en las leyes. Los jóvenes pueden promover un referendo aprobatorio de iniciativa ciudadana sin n"},
  92:{r:"C",e:"Los expertos identifican que el foco de la contaminación son sustancias como el aceite usado en casas, restaurantes e industria, cuyas tuberías de desagüe están conectadas a la fuente de agua. El aceite que se vierte al desagüe llega directamente a l"},
  93:{r:"D",e:"La fotosíntesis produce carbohidratos (glucosa) a partir de CO₂, agua y energía solar: 6CO₂ + 6H₂O + energía → C₆H₁₂O₆ + 6O₂. Los carbohidratos son la fuente de energía y el material de construcción de la planta. Sin fotosíntesis no se producen carbo"},
  94:{r:"D",e:"Los datos muestran que tanto la riqueza (68→62→45→22→12) como la cantidad de individuos (1.563→1.621→803→456→102) disminuyen progresivamente del 2003 al 2023 (con una pequeña subida en individuos en 2008). La opción D muestra dos líneas de tendencia "},
  95:{r:"B",e:"Según el esquema de wifi zonas comunitarias, la información proveniente de internet llega al pueblo exclusivamente a través del cable de fibra óptica hasta la antena principal. Sin esta conexión, la antena principal no tendría señal de internet que r"},
  96:{r:"D",e:"La frecuencia es el número de ciclos por unidad de tiempo. Si la frecuencia del Grupo 2 es 5 veces mayor que la del Grupo 1, en el mismo intervalo de tiempo el Grupo 2 debe mostrar 5 veces más ciclos completos. La opción D muestra correctamente que G"},
  97:{r:"D",e:"El esquema Megazonas wifi muestra múltiples cabeceras rurales conectadas entre sí a través de antenas principales y secundarias. Mostrar estas conexiones visualmente evidencia que el sistema puede enlazar varias poblaciones simultáneamente con señal "},
  98:{r:"A",e:"Pedro observó que la fruta tardó varios días en descomponerse y planteó que los cambios químicos necesitan varios días. El libro dice que la velocidad de reacciones depende de factores como temperatura, concentración y catalizadores. La hipótesis de "},
  99:{r:"A",e:"El fenómeno descrito es especiación alopátrica: una sola población de monos queda dividida por un río, generando dos grupos que se reproducen de forma aislada durante mucho tiempo hasta convertirse en dos especies distintas. El modelo correcto muestr"},
  100:{r:"A",e:"El estudiante aplica una fuerza que aumenta progresivamente mientras recorre los primeros 4 m. Luego ejerce una fuerza constante para los últimos 2 m (de 4 a 6 m). La gráfica correcta muestra una línea ascendente de 0 a 4 m y una línea horizontal (co"},
  101:{r:"B",e:"Mineral 3: Azul, No metálico, Sí — Mineral 6: Azul, No metálico, Sí → idénticos. Mineral 2: Rojo, No metálico, No — Mineral 7: Rojo, No metálico, No → idénticos. La opción B identifica correctamente estos dos pares con características iguales."},
  102:{r:"C",e:"La mitosis produce células hijas idénticas a la célula madre. En el folículo capilar, las células capilares se dividen por mitosis generando nuevas células que secretan fibras de queratina. Este aumento continuo de células es el que permite el crecim"},
  103:{r:"B",e:"Con el ave: el parásito infecta el hígado y daña los glóbulos rojos → interacción negativa (parasitismo). Con el zancudo: el parásito se reproduce en el intestino del insecto \'sin afectar su funcionamiento\' → interacción neutral (comensalismo o sin d"},
  104:{r:"B",e:"Los isótopos son átomos del mismo elemento (mismo número de protones) con diferente número de neutrones. Ñ tiene 1 protón y 0 neutrones; Y tiene 1 protón y 2 neutrones. Ambos tienen 1 protón (mismo elemento) pero diferente número de neutrones → son i"},
  105:{r:"A",e:"La disolución 2 tiene % p/p = 24%, % p/v = 24% y Molaridad = 4,10 M, mientras que la disolución 1 tiene 12%, 12% y 2,05 M respectivamente. En iguales volúmenes, la disolución 2 tiene mayor concentración (mayor % y mayor molaridad), lo que indica mayo"},
  106:{r:"C",e:"La conclusión de Camila es que los líquidos viscosos disminuyen la velocidad de la esfera. Para validar esto, necesita saber cuál líquido usó en cada medición y cuál es la viscosidad de cada uno. Sin los datos de viscosidad de cada líquido, no puede "},
  107:{r:"C",e:"La tabla indica que la fibra insoluble \'absorbe agua y favorece el paso de los alimentos por el tracto digestivo, y regulariza la función del intestino\'. El estreñimiento se caracteriza por tránsito intestinal lento y dificultad para evacuar. La fibr"},
  108:{r:"A",e:"La hipótesis es: a mayor tamaño de papa, mayor tiempo de reacción. Esto es una relación directamente proporcional. La gráfica correcta debe mostrar barras en orden descendente: Grande (barra más alta) > Mediana (barra media) > Pequeña (barra más baja"},
  109:{r:"C",e:"El proceso criogénico enfría el caucho a temperaturas muy bajas (–70°C o menos) haciéndolo frágil y fácil de triturar. Si el túnel de enfriamiento falla, el caucho estará a temperatura ambiente y será más elástico y resistente. Para triturarlo sin en"},
  110:{r:"A",e:"Al enfriar el caucho hasta –70°C o menos, se vuelve frágil y se rompe con un solo paso por el molino. La trituración simple a temperatura ambiente requiere múltiples pasadas por los molinos para lograr el mismo resultado. La ventaja de la trituración"},
  111:{r:"C",e:"En el túnel de enfriamiento, el nitrógeno líquido (a –200°C) está en contacto con el caucho (a temperatura ambiente). La energía interna (calor) del caucho fluye hacia el nitrógeno más frío, proceso que reduce la temperatura del caucho. La energía in"},
  112:{r:"C",e:"A presión constante, un aumento de temperatura aumenta la energía cinética de las partículas, que chocan más frecuente y fuertemente entre sí y contra las paredes. Como las paredes son flexibles, el gas se expande (aumenta el volumen) hasta que la pr"},
  113:{r:"B",e:"La mariposa presenta metamorfosis completa (holometabolismo): huevo → larva (oruga) → pupa (crisálida) → adulto. Existe una fase intermedia (pupa) entre la larva y el adulto, y las transformaciones son drásticas (la larva no se parece al adulto). Est"},
  114:{r:"D",e:"Comparando con los rangos de tolerancia: pH = 10,4 (máximo tolerable: 8,8) → fuera de rango. Amoníaco = 25,8 mg/L (máximo: 23,7 mg/L) → fuera de rango. Temperatura = 22,4°C (rango: 19,6–33,7°C) → dentro del rango. Nitrito = 0,9 mg/L (máximo: 1,1 mg/L"},
  115:{r:"C",e:"La intensidad de las gotas sigue la ley del inverso del cuadrado: I ∝ 1/d². A 2 m la intensidad es ¼ mm. A 5 m (2,5 veces más lejos): I = ¼ × (2/5)² = ¼ × 4/25 = 1/25 mm. La intensidad a 5 m es menor que a 2 m, y disminuye proporcionalmente al cuadra"},
  116:{r:"D",e:"La hipótesis del estudiante era que alcohol y aceite formarían una solución homogénea. El resultado experimental mostró dos capas separadas (aceite abajo, alcohol arriba), lo que es una mezcla heterogénea. Esto refuta la hipótesis: el alcohol no se d"},
  117:{r:"A",e:"Las cuatro etapas: 1) Sin crecimiento (lag) = línea plana inicial. 2) Crecimiento exponencial = línea ascendente. 3) Fase estacionaria (nutrientes agotados) = línea plana en la cima. 4) Muerte progresiva = línea descendente. La opción A muestra la cu"},
  118:{r:"D",e:"En el cruce, la mosca de ojos rojos tiene alelos G y g (heterocigota). La mosca de ojos blancos tiene alelo g. Del cruce se obtienen descendientes Gg y gg. El individuo resultante mostrado en la figura tiene los alelos G y g, lo que lo hace heterocig"},
  119:{r:"D",e:"Requisitos: punto de ebullición < 130°C, soluble en agua, no conductora. Evaluando: Sustancia 1: –196°C ✓, soluble ✓, conductora ✗. Sustancia 2: 59°C ✓, soluble ✓, conductora ✗. Sustancia 3: –188°C ✓, no soluble ✗, no conductora ✓. Sustancia 4: –34°C"},
  120:{r:"B",e:"Durante los cambios de fase, la temperatura permanece constante aunque se siga añadiendo energía (el calor se usa para romper los enlaces, no para subir la temperatura). La gráfica correcta muestra: línea ascendente (sólido) → meseta (fusión a 1.535°"}
};

// ── ESTADO
let usuario = null, modo = "practica", mat = null;
let qLista = [], idx = 0, resps = {}, progFire = {}, adminData = [];
let tInt = null, tPreg = 0, tTotal = 0;
let tVisible = true, tModo = "normal", tValor = 60;
let sbVisible = true;

// ── HELPERS
const $ = id => document.getElementById(id);
const sp = v => { const el = $("spinner"); if(el) el.className = v ? "" : "oculto"; };
const fmt = s => {
  const neg = s < 0, a = Math.abs(s);
  return (neg ? "-" : "") + Math.floor(a/60) + ":" + String(a%60).padStart(2,"0");
};
const pad2 = n => String(n).padStart(2,"0");
const imgSrc = id => "pregunta_" + pad2(id) + ".jpg";
const getMatOf = id => {
  for(const [k,m] of Object.entries(MATS)) if(id>=m.r[0]&&id<=m.r[1]) return k;
  return "matematicas";
};
const porMat = m => {
  if(m==="todas") return Array.from({length:120},(_,i)=>i+1);
  const [a,b]=MATS[m].r; return Array.from({length:b-a+1},(_,i)=>i+a);
};
const ir = id => {
  document.querySelectorAll(".pantalla").forEach(p=>p.classList.remove("activa"));
  const el = $(id); if(el) { el.classList.add("activa"); window.scrollTo(0,0); }
};

// ── AUTH
window.loginGoogle = async () => {
  sp(true);
  try {
    const r = await signInWithPopup(auth, prov);
    await setDoc(doc(db,"usuarios",r.user.uid),{
      nombre:r.user.displayName, email:r.user.email,
      foto:r.user.photoURL, ultimoAcceso:serverTimestamp()
    },{merge:true});
  } catch(e) { alert("Error al iniciar sesión: "+e.message); sp(false); }
};
window.cerrarSesion = async () => { try { await signOut(auth); } catch(e){} };

onAuthStateChanged(auth, async u => {
  sp(true);
  try {
    if(u) {
      usuario = u;
      const av = $("foto-u"); if(av) av.src = u.photoURL||"";
      const nm = $("nombre-u"); if(nm) nm.textContent = u.displayName?.split(" ")[0]||"";
      const sl = $("saludo"); if(sl) sl.textContent = "¡Hola, "+(u.displayName?.split(" ")[0]||"")+"! 👋";
      await cargarProgreso();
      mostrarHome();
    } else {
      usuario = null;
      ir("p-login");
    }
  } catch(e) { console.error("Auth error:", e); ir("p-login"); }
  sp(false);
});

// ── FIRESTORE
async function guardarResp(matKey, id, datos) {
  if(!usuario) return;
  try {
    await setDoc(doc(db,"usuarios",usuario.uid,"progreso",matKey,"respuestas",String(id)), datos);
    await setDoc(doc(db,"usuarios",usuario.uid,"sesion","actual"),{
      mat, idx, modo, tTotal, ts:serverTimestamp()
    });
  } catch(e) { console.warn("FS write:", e.message); }
}

async function cargarProgreso() {
  if(!usuario) return;
  progFire = {};
  for(const k of Object.keys(MATS)) {
    progFire[k] = {};
    try {
      const snap = await getDocs(collection(db,"usuarios",usuario.uid,"progreso",k,"respuestas"));
      snap.forEach(d => { progFire[k][d.id] = d.data(); });
    } catch(e) {}
  }
}

async function cargarSesion() {
  if(!usuario) return null;
  try {
    const d = await getDoc(doc(db,"usuarios",usuario.uid,"sesion","actual"));
    return d.exists() ? d.data() : null;
  } catch(e) { return null; }
}

async function resetMatFS(k) {
  if(!usuario) return;
  try {
    const snap = await getDocs(collection(db,"usuarios",usuario.uid,"progreso",k,"respuestas"));
    await Promise.all(snap.docs.map(d=>deleteDoc(d.ref)));
  } catch(e) {}
  progFire[k] = {};
}

window.resetMiProgreso = async () => {
  if(!confirm("¿Borrar todo tu progreso?")) return;
  sp(true);
  for(const k of Object.keys(MATS)) await resetMatFS(k);
  try { await deleteDoc(doc(db,"usuarios",usuario.uid,"sesion","actual")); } catch(e) {}
  await cargarProgreso();
  mostrarHome();
  sp(false);
};

// ── MODO
window.setModo = m => {
  modo = m;
  ["practica","simulacro"].forEach(v => {
    const b = $("bm-"+v); if(b) b.className = "modo-btn"+(m===v?" activo":"");
  });
};

// ── HOME
window.mostrarHome = () => { pararTimer(); construirHome(); ir("p-home"); };
window.salirQuiz = () => {
  if(confirm("¿Salir? Tu progreso está guardado.")) { pararTimer(); mostrarHome(); }
};

function construirHome() {
  const grid = $("grid-materias"); if(!grid) return;
  grid.innerHTML = "";
  let tR=0,tC=0,tT=0;
  for(const [k,m] of Object.entries(MATS)) {
    const ids = porMat(k), prog = progFire[k]||{};
    const hechas = Object.keys(prog).length;
    const corr = Object.values(prog).filter(r=>r.correcta).length;
    tR+=hechas; tC+=corr;
    tT+=Object.values(prog).reduce((s,r)=>s+(r.tiempo||0),0);
    const pct = ids.length ? Math.round(hechas/ids.length*100) : 0;
    const card = document.createElement("div");
    card.className = "card-mat"; card.style.color = m.c;
    card.innerHTML = "<div class=em>"+m.e+"</div><h3>"+m.n+"</h3>"+
      "<div class=nm>"+ids.length+" preguntas</div>"+
      "<div class=pb><div class=pf style=\"width:"+pct+"%;background:"+m.c+"\"></div></div>"+
      "<div class=pt>"+hechas+"/"+ids.length+" · "+corr+" correctas</div>";
    card.onclick = () => iniciarQuiz(k);
    grid.appendChild(card);
  }
  const els = {st_tot:tR, st_cor:tC, st_pct:tR?Math.round(tC/tR*100)+"%":"—", st_tim:fmt(tT)};
  Object.entries(els).forEach(([id,v]) => { const e=$(id.replace("_","-")); if(e) e.textContent=v; });
}

// ── QUIZ
window.iniciarQuiz = async m => {
  sp(true);
  try {
    // Leer config de cronómetro
    tVisible = $("timer-on")?.checked !== false;
    const radModo = document.querySelector("input[name=timer-modo]:checked");
    tModo  = radModo?.value || "normal";
    tValor = parseInt($("timer-valor")?.value)||60;
    if(tValor < 5) tValor = 5;
    sbVisible = true;

    // Intentar reanudar sesión
    const ses = await cargarSesion();
    if(ses && ses.mat===m && Object.keys(resps).length===0 &&
       confirm("Tienes un examen en progreso. ¿Continuar donde lo dejaste?")) {
      mat = m; modo = ses.modo||modo;
      qLista = porMat(m); idx = Math.min(ses.idx||0, qLista.length-1);
      tTotal = ses.tTotal||0; tPreg = 0; resps = {};
      if(m==="todas") { for(const [k,v] of Object.entries(progFire))
        Object.entries(v).forEach(([id,r])=>{ resps[Number(id)]=r; }); }
      else { Object.entries(progFire[m]||{}).forEach(([id,r])=>{ resps[Number(id)]=r; }); }
    } else {
      mat = m; qLista = porMat(m); idx = 0; resps = {}; tTotal = 0; tPreg = 0;
    }

    // Header materia
    const color = m==="todas"?"#1e293b":MATS[m].c;
    const nombre = m==="todas"?"Simulacro completo":MATS[m].n;
    const tag = $("qh-mat"); if(tag) { tag.textContent=nombre; tag.style.background=color; }

    // Cronómetros
    const tw = $("timers-wrap"); if(tw) tw.style.display = tVisible?"flex":"none";
    const tb = $("timer-quiz-btn"); if(tb) tb.textContent = tVisible?"👁 Ocultar":"👁 Mostrar";

    // Sidebar
    aplicarSidebar();
    construirSidebar();
    ir("p-quiz");
    renderPregunta();
    iniciarTimer();
  } catch(e) { console.error("iniciarQuiz error:", e); }
  sp(false);
};

// ── SIDEBAR
function construirSidebar() {
  const sb = $("sb-content"); if(!sb) return;
  sb.innerHTML = "";
  const mkeys = mat==="todas"?Object.keys(MATS):[mat];
  mkeys.forEach(k => {
    const m = MATS[k];
    const wrap = document.createElement("div"); wrap.className="sb-mat";
    wrap.innerHTML = "<div class=sb-mat-lbl style=background:"+m.c+">"+m.e+" "+m.n+"</div>"+
                     "<div class=sb-nums id=sb-"+k+"></div>";
    sb.appendChild(wrap);
  });
  actualizarSidebar();
}

function actualizarSidebar() {
  const mkeys = mat==="todas"?Object.keys(MATS):[mat];
  mkeys.forEach(k => {
    const cont = $("sb-"+k); if(!cont) return;
    cont.innerHTML = "";
    const ids = porMat(k).filter(id=>qLista.includes(id));
    ids.forEach(id => {
      const btn = document.createElement("button");
      btn.className = "qb";
      btn.textContent = id;
      const i = qLista.indexOf(id);
      if(resps[id]) btn.classList.add("ans");
      if(i===idx)   btn.classList.add("cur");
      btn.onclick = () => { idx=i; renderPregunta(); };
      cont.appendChild(btn);
    });
  });
}

window.toggleSidebar = () => { sbVisible=!sbVisible; aplicarSidebar(); };
function aplicarSidebar() {
  const sb  = $("quiz-sidebar");
  const btn = $("btn-sb-show");
  if(sb)  sb.style.display  = sbVisible?"block":"none";
  if(btn) btn.style.display = sbVisible?"none":"inline-block";
}

// ── RENDER PREGUNTA
function renderPregunta() {
  const id  = qLista[idx];
  const tot = qLista.length;
  const mk  = getMatOf(id);
  const color = MATS[mk]?.c||"#2563eb";

  const qn = $("q-num"); if(qn) qn.textContent = "Pregunta "+id;
  const qp = $("qh-prog"); if(qp) qp.textContent = "Pregunta "+(idx+1)+" de "+tot;
  const bar = $("qh-barra"); if(bar) { bar.style.width=(idx/tot*100)+"%"; bar.style.background=color; }
  tPreg = 0;

  // Imagen — tamaño controlado
  const qi = $("q-img");
  if(qi) qi.innerHTML = "<img src=\""+imgSrc(id)+"\" alt=\"Pregunta "+id+"\" loading=\"lazy\""+
    " style=\"max-width:100%;max-height:360px;width:auto;display:block;margin:0 auto;border-radius:8px;\""+
    " onload=\"this.style.opacity=1\" onerror=\"this.parentElement.innerHTML=\'<div style=padding:20px;color:#94a3b8>⚠️ Imagen no disponible</div>\'\" />";

  // Limpiar explicación
  const ex = $("q-expl"); if(ex) { ex.className="expl"; ex.innerHTML=""; }

  // Opciones
  const opsEl = $("q-ops"); if(!opsEl) return;
  opsEl.innerHTML = "";

  if(modo==="simulacro") {
    const g = document.createElement("div"); g.className="ops-sim";
    ["A","B","C","D"].forEach(l => {
      const btn = document.createElement("button");
      btn.className = "op-sim"+(resps[id]?.elegida===l?" sel":"");
      btn.textContent = l;
      btn.onclick = () => {
        g.querySelectorAll(".op-sim").forEach(b=>b.classList.remove("sel"));
        btn.classList.add("sel");
        const ok = l===QA[id].r;
        resps[id] = {elegida:l, correcta:ok, tiempo:tPreg};
        const key = mat==="todas"?getMatOf(id):mat;
        guardarResp(key, id, resps[id]);
        if(!progFire[key]) progFire[key]={};
        progFire[key][String(id)] = resps[id];
        actualizarSidebar(); actualizarBtnTer();
      };
      g.appendChild(btn);
    });
    opsEl.appendChild(g);
    const sig = $("btn-sig"); if(sig) sig.style.display="none";
    const ant = $("btn-ant"); if(ant) ant.style.display=idx>0?"inline-block":"none";
    actualizarBtnTer();
  } else {
    // Práctica — grid 2×2
    const g = document.createElement("div"); g.className="ops";
    ["A","B","C","D"].forEach(l => {
      const btn = document.createElement("button");
      btn.className = "op";
      btn.textContent = l;
      btn.onclick = () => responderPractica(l, id);
      g.appendChild(btn);
    });
    opsEl.appendChild(g);
    const sig = $("btn-sig"); if(sig) sig.classList.remove("vis");
    const ant = $("btn-ant"); if(ant) ant.style.display=idx>0?"inline-block":"none";
    const ter = $("btn-ter"); if(ter) ter.style.display="none";
    // Si ya respondió
    if(resps[id]) {
      g.querySelectorAll(".op").forEach(b=>{
        b.classList.add("bloq"); b.onclick=null;
        if(b.textContent===QA[id].r) b.classList.add("correcta");
        if(b.textContent===resps[id].elegida&&!resps[id].correcta) b.classList.add("incorrecta");
      });
      if(ex) {
        const ok = resps[id].correcta;
        ex.innerHTML = "<strong>"+(ok?"✅ ¡Correcto!":"❌ Incorrecto.")+"</strong> "+QA[id].e;
        ex.className = "expl vis";
      }
      if(sig) sig.classList.add("vis");
    }
  }
  actualizarSidebar();
}

function responderPractica(elegida, id) {
  const ok = elegida===QA[id].r;
  $("q-ops").querySelectorAll(".op").forEach(b=>{
    b.classList.add("bloq"); b.onclick=null;
    if(b.textContent===QA[id].r) b.classList.add("correcta");
    if(b.textContent===elegida&&!ok) b.classList.add("incorrecta");
  });
  const ex = $("q-expl");
  if(ex) {
    ex.innerHTML = "<strong>"+(ok?"✅ ¡Correcto!":"❌ Incorrecto.")+"</strong> "+QA[id].e;
    ex.className = "expl vis";
  }
  const sig = $("btn-sig"); if(sig) sig.classList.add("vis");
  resps[id] = {elegida, correcta:ok, tiempo:tPreg};
  const key = mat==="todas"?getMatOf(id):mat;
  guardarResp(key, id, resps[id]);
  if(!progFire[key]) progFire[key]={};
  progFire[key][String(id)] = resps[id];
  actualizarSidebar();
}

function actualizarBtnTer() {
  const ter = $("btn-ter"); if(!ter) return;
  const resp = qLista.filter(id=>resps[id]).length;
  ter.style.display = "inline-block";
  ter.textContent = "✅ Terminar ("+resp+"/"+qLista.length+")";
}

window.siguientePregunta = () => {
  if(idx<qLista.length-1) { idx++; renderPregunta(); }
  else { pararTimer(); mostrarResultados(); }
};
window.anteriorPregunta = () => { if(idx>0) { idx--; renderPregunta(); } };
window.terminarSimulacro = () => {
  if(confirm("¿Terminar y ver resultados?")) { pararTimer(); mostrarResultados(); }
};

// ── TIMER
function iniciarTimer() {
  pararTimer();
  tInt = setInterval(() => {
    tTotal++; tPreg++;
    if(!tVisible) return;
    const el = $("t-preg"), et = $("t-total");
    if(!el) return;
    if(tModo==="temporizador") {
      const r = tValor - tPreg;
      if(r >= 0) {
        el.textContent = "⏱ "+fmt(r);
        el.className = "t-preg"+(r<=10?" urgente":"");
      } else {
        el.innerHTML = "⏱ <span style=\"font-size:.8em;color:#dc2626\">"+fmt(r)+"</span>";
        el.className = "t-preg";
      }
    } else {
      el.textContent = "⏱ "+fmt(tPreg);
      el.className = "t-preg";
    }
    if(et) et.textContent = "Total: "+fmt(tTotal);
  }, 1000);
}
function pararTimer() { clearInterval(tInt); }

window.toggleTimerQuiz = () => {
  tVisible = !tVisible;
  const tw = $("timers-wrap"); if(tw) tw.style.display = tVisible?"flex":"none";
  const tb = $("timer-quiz-btn"); if(tb) tb.textContent = tVisible?"👁 Ocultar":"👁 Mostrar";
};

// ── RESULTADOS
function mostrarResultados() {
  const vals = Object.values(resps);
  const total = qLista.length, corr = vals.filter(r=>r.correcta).length;
  const resp = vals.length, pct = resp?Math.round(corr/resp*100):0;
  const tT = vals.reduce((s,r)=>s+(r.tiempo||0),0);

  const emojis = pct>=80?"🏆":pct>=60?"😊":pct>=40?"💪":"📚";
  const titulo = pct>=80?"¡Excelente resultado!":pct>=60?"¡Buen trabajo!":pct>=40?"¡Sigue practicando!":"¡No te rindas!";
  const setEl = (id,v) => { const e=$(id); if(e) e.textContent=v; };
  setEl("res-em", emojis); setEl("res-tit", titulo);
  setEl("res-sub", resp+" respondidas de "+total+" · "+corr+" correctas");
  setEl("res-cor", corr); setEl("res-inc", resp-corr);
  setEl("res-pct", pct+"%"); setEl("res-tim", fmt(tT));
  const br = $("btn-reintentar"); if(br) br.onclick = () => reintentar();

  // Por materia
  const pm = $("por-mat"); if(pm) {
    pm.innerHTML="";
    (mat==="todas"?Object.keys(MATS):[mat]).forEach(k=>{
      const m=MATS[k]; if(!m) return;
      const ids=porMat(k).filter(id=>qLista.includes(id)); if(!ids.length) return;
      const ok=ids.filter(id=>resps[id]?.correcta).length;
      const p=Math.round(ok/ids.length*100);
      const d=document.createElement("div"); d.className="mat-rc";
      d.innerHTML="<h4>"+m.e+" "+m.n+"</h4>"+
        "<div class=mbb><div class=mbf style=\"width:"+p+"%;background:"+m.c+"\"></div></div>"+
        "<div class=mfr>"+ok+"/"+ids.length+" ("+p+"%)</div>";
      pm.appendChild(d);
    });
  }

  // Hoja tipo ICFES
  const hoja = $("hoja-grid"); if(hoja) {
    hoja.innerHTML="";
    qLista.forEach(id=>{
      const r=resps[id], cor=QA[id].r, ok=r?.correcta, sk=!r;
      const fila=document.createElement("div"); fila.className="hf";
      const hn=document.createElement("div");
      hn.className="hn "+(sk?"sk":ok?"ok":"mal"); hn.textContent=id;
      fila.appendChild(hn);
      const hopc=document.createElement("div"); hopc.className="hopc";
      ["A","B","C","D"].forEach(l=>{
        const op=document.createElement("div"); op.className="hop"; op.textContent=l;
        if(l===cor) op.classList.add("cor");
        if(r&&l===r.elegida&&!ok) op.classList.add("inc");
        hopc.appendChild(op);
      });
      fila.appendChild(hopc); hoja.appendChild(fila);
    });
  }

  // Detalle
  const det = $("det-list"); if(det) {
    det.innerHTML="";
    qLista.forEach(id=>{
      const r=resps[id], cor=QA[id].r, ok=r?.correcta;
      const d=document.createElement("div"); d.className="det-item";
      d.innerHTML="<img class=det-thumb src=\""+imgSrc(id)+"\" alt=P"+id+
        " style=\"max-height:50px;width:auto;\" onerror=\"this.style.display=none\"/>"+
        "<div class=det-info><strong>P"+id+"</strong> — "+(MATS[getMatOf(id)]?.n||"")+
        "<div class=bgs>"+
        (!r?"<span class=\"bg sk\">Sin responder</span><span class=\"bg cor\">Correcta: "+cor+"</span>":"")+
        (r&&ok?"<span class=\"bg ok\">✓ "+r.elegida+"</span>":"")+
        (r&&!ok?"<span class=\"bg mal\">Tu resp: "+r.elegida+"</span><span class=\"bg cor\">Correcta: "+cor+"</span>":"")+
        "</div><div class=expl-t>"+QA[id].e.substring(0,180)+"…</div></div>";
      det.appendChild(d);
    });
  }

  // Guardar resultado
  if(usuario) {
    setDoc(doc(db,"usuarios",usuario.uid,"resultados",new Date().toISOString().slice(0,19).replace(/:/g,"-")),{
      fecha:serverTimestamp(), modo, materia:mat, total, correctas:corr, pct, tiempo:tT
    }).catch(()=>{});
    deleteDoc(doc(db,"usuarios",usuario.uid,"sesion","actual")).catch(()=>{});
  }
  ir("p-resultados");
}

window.reintentar = async () => {
  sp(true);
  if(mat!=="todas") await resetMatFS(mat);
  else for(const k of Object.keys(MATS)) await resetMatFS(k);
  await iniciarQuiz(mat);
  sp(false);
};

// ── ADMIN
window.irAdmin = () => {
  const eu=$("admin-user-input"), ep=$("admin-pass-input"), er=$("admin-error");
  if(eu) eu.value=""; if(ep) ep.value=""; if(er) er.style.display="none";
  ir("p-admin-login");
  setTimeout(()=>{ if(eu) eu.focus(); },100);
};

window.verificarAdmin = () => {
  const u=$("admin-user-input")?.value.trim();
  const p=$("admin-pass-input")?.value.trim();
  const er=$("admin-error");
  if(u!==ADMIN_U||p!==ADMIN_P) {
    if(er){er.textContent="❌ Usuario o contraseña incorrectos.";er.style.display="block";}
    const ep=$("admin-pass-input"); if(ep) ep.value="";
    return;
  }
  if(er) er.style.display="none";
  cargarAdmin();
};

window.cargarAdmin = async () => {
  sp(true); ir("p-admin");
  try {
    const snap = await getDocs(collection(db,"usuarios"));
    adminData = [];
    for(const d of snap.docs) {
      const u=d.data(), uid=d.id;
      let tR=0,tC=0,tT=0; const md={};
      for(const k of Object.keys(MATS)) {
        try {
          const rs=await getDocs(collection(db,"usuarios",uid,"progreso",k,"respuestas"));
          let r=0,c=0;
          rs.forEach(rd=>{ const x=rd.data(); r++; if(x.correcta) c++; tT+=(x.tiempo||0); });
          tR+=r; tC+=c; md[k]={r,c};
        } catch(e) {}
      }
      adminData.push({uid,nombre:u.nombre||"",email:u.email||"",foto:u.foto||"",
        acceso:u.ultimoAcceso,tR,tC,tT,md});
    }
    renderTablaAdmin(adminData);
    const act=adminData.filter(a=>a.tR>0);
    const prom=act.length?Math.round(act.reduce((s,a)=>s+(a.tR?Math.round(a.tC/a.tR*100):0),0)/act.length):0;
    const setS=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
    setS("adm-total",adminData.length); setS("adm-activos",act.length);
    setS("adm-promedio",prom+"%"); setS("adm-completos",adminData.filter(a=>a.tR>=120).length);
  } catch(e) { alert("Error: "+e.message); }
  sp(false);
};

function renderTablaAdmin(data) {
  const tb=$("adm-tbody"); if(!tb) return; tb.innerHTML="";
  data.forEach(a=>{
    const pct=a.tR?Math.round(a.tC/a.tR*100):0;
    const lvl=pct>=70?"alto":pct>=50?"medio":"bajo";
    const badges=Object.entries(MATS).map(([k,m])=>{
      const d=a.md[k]||{r:0,c:0};
      return "<span class=mb style=background:"+m.c+">"+m.e+" "+d.c+"/"+d.r+"</span>";
    }).join("");
    const fecha=a.acceso?.toDate?a.acceso.toDate().toLocaleDateString("es-CO"):"—";
    const tr=document.createElement("tr");
    tr.innerHTML="<td><div class=td-name><img class=td-av src=\""+a.foto+"\" onerror=\"this.style.display=none\"/>"+
      "<div><div style=font-weight:600>"+a.nombre+"</div><div style=\"font-size:.75rem;color:#64748b\">"+a.email+"</div></div></div></td>"+
      "<td>"+fecha+"</td><td>"+badges+"</td>"+
      "<td><span class=\"pp "+lvl+"\">"+pct+"% ("+a.tC+"/"+a.tR+")</span></td>"+
      "<td>"+fmt(a.tT)+"</td>"+
      "<td><button class=\"ba danger\" style=\"padding:5px 10px;font-size:.75rem\" "+
      "onclick=\"resetEstudiante('"+a.uid+"','"+a.nombre+"')\">Reset</button></td>";
    tb.appendChild(tr);
  });
}

window.filtrarEstudiantes = () => {
  const q=$("adm-buscar")?.value.toLowerCase()||"";
  renderTablaAdmin(adminData.filter(a=>a.nombre.toLowerCase().includes(q)||a.email.toLowerCase().includes(q)));
};

window.resetEstudiante = async (uid, nombre) => {
  if(!confirm("¿Resetear progreso de "+nombre+"?")) return;
  sp(true);
  try {
    for(const k of Object.keys(MATS)) {
      const snap=await getDocs(collection(db,"usuarios",uid,"progreso",k,"respuestas"));
      await Promise.all(snap.docs.map(d=>deleteDoc(d.ref)));
    }
    try { await deleteDoc(doc(db,"usuarios",uid,"sesion","actual")); } catch(e){}
    alert("Progreso de "+nombre+" reseteado.");
    await cargarAdmin();
  } catch(e) { alert("Error: "+e.message); }
  sp(false);
};

window.resetTodosAdmin = async () => {
  if(!confirm("⚠️ ¿Borrar el progreso de TODOS los estudiantes?")) return;
  sp(true);
  try {
    const snap=await getDocs(collection(db,"usuarios"));
    for(const d of snap.docs) {
      const uid=d.id;
      for(const k of Object.keys(MATS)) {
        const rs=await getDocs(collection(db,"usuarios",uid,"progreso",k,"respuestas"));
        await Promise.all(rs.docs.map(x=>deleteDoc(x.ref)));
      }
      try { await deleteDoc(doc(db,"usuarios",uid,"sesion","actual")); } catch(e){}
    }
    alert("Todo el progreso fue reseteado.");
    await cargarAdmin();
  } catch(e) { alert("Error: "+e.message); }
  sp(false);
};

window.exportarCSV = () => {
  const rows=[["Nombre","Email","Respondidas","Correctas","%","Tiempo","Mat%","Lec%","Soc%","Nat%"]];
  adminData.forEach(a=>{
    const pct=a.tR?Math.round(a.tC/a.tR*100):0;
    const gp=k=>{ const d=a.md[k]||{r:0,c:0}; return d.r?Math.round(d.c/d.r*100):0; };
    rows.push([a.nombre,a.email,a.tR,a.tC,pct+"%",fmt(a.tT),
      gp("matematicas")+"%",gp("lectura")+"%",gp("sociales")+"%",gp("naturales")+"%"]);
  });
  const csv=rows.map(r=>r.map(v=>"\""+v+"\"").join(",")).join("\n");
  const a=document.createElement("a");
  a.href="data:text/csv;charset=utf-8,\uFEFF"+encodeURIComponent(csv);
  a.download="saber11_"+new Date().toISOString().slice(0,10)+".csv"; a.click();
};

// ── CONFIG CRONÓMETRO (HOME)
window.toggleTimerConfig = () => {
  const on=$("timer-on")?.checked;
  const body=$("tc-body"); if(body) body.style.display=on?"block":"none";
};
window.toggleTimerValor = () => {
  const v=$("tc-valor");
  const m=document.querySelector("input[name=timer-modo]:checked")?.value;
  if(v) v.style.display=m==="temporizador"?"flex":"none";
};

// Init DOM
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("input[name=timer-modo]").forEach(r=>{
    r.addEventListener("change",()=>{
      const v=$("tc-valor"); if(v) v.style.display=r.value==="temporizador"?"flex":"none";
    });
  });
  const ton=$("timer-on");
  if(ton) ton.addEventListener("change",()=>{
    const b=$("tc-body"); if(b) b.style.display=ton.checked?"block":"none";
  });
});
