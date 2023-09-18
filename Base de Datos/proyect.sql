create table usuarios (
idUsuario varchar(255) not null,
nombre varchar(255), 
apellido varchar(255), 
cedula varchar(255), 
email varchar(255),
telefono varchar(255), 
nomUsuario varchar(255),
contraseña varchar(255),
preguntaSeguridad enum ('¿Cuándo es tu cumpleaños?', '¿Cómo se llamaba tu mamá?'), 
respuestaSeguridad varchar(255),  
tipoUsuario enum ('Prestamista', 'Prestatario'),
fechaNac date,
primary key(idUsuario));

create table documentos (
idDocumento varchar(255) not null,
idUsuario varchar(255) not null, 
numCuenta varchar(255), 
banco varchar(255), 
docCedula  varchar(255),
docReferencia varchar(255), 
docEstado varchar(255), 
primary key(idDocumento),
foreign key(idUsuario) references usuarios (idUsuario) on delete cascade);

create table perfilPrestatarios (
idPrestatario varchar(255) not null,
idUsuario varchar(255) not null,
cantSolicitudes int,
cantPrestamosOtorgadoss int,
cantPrestamosFinalizados int,
primary key(idPrestatario),
foreign key(idUsuario) references usuarios (idUsuario)on delete cascade);

create table evaluacionCrediticia (
idEvaluacion varchar(255) not null,
idPrestatario varchar(255) not null,
puntajeCrediticio int,
vencimiento date,
primary key(idEvaluacion),
foreign key(idPrestatario) references perfilPrestatarios (idPrestatario)on delete cascade);

create table perfilPrestamistas (
idPrestamista varchar(255) not null,
idUsuario varchar(255) not null,
cantOfertas int,
cantPrestamosActivos int,
cantPrestamosConcedidos int,
cantPrestamosFinalizados int,
primary key(idPrestamista),
foreign key(idUsuario) references usuarios (idUsuario)on delete cascade);

create table Prestamos (
idPrestamo varchar(255) not null,
idPrestamista varchar(255) not null,
estadoPrestamo varchar(255),
fechaInicio date,
cuotas int,
fechaFinal date,
tasaInteres float,
abonado float not null,
montoTotal float not null,
metodoPago varchar(255),
deuda float,
primary key(idPrestamo),
foreign key(idPrestamista) references perfilPrestamistas (idPrestamista)on delete cascade);

create table solicitudPrestamos (
idSolicitud varchar(255) not null,
idPrestatario varchar(255) not null,
idPrestamo varchar(255) not null,
estado  varchar(255) not null,
fecha date,
PrestatarioNom varchar(255),
primary key(idSolicitud),
foreign key(idPrestamo) references Prestamos (idPrestamo)on delete cascade,
foreign key(idPrestatario) references perfilPrestatarios (idPrestatario)on delete cascade);

create table historialMovimiento (
idHistorial varchar(255) not null,
idPrestamo varchar(255) not null,
fechaAbono date,
abono float,
primary key(idHistorial),
foreign key(idPrestamo) references Prestamos (idPrestamo)on delete cascade);

