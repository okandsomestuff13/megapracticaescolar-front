import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_alumnos: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['id_alumno', 'nombre', "matricula",'email', 'fecha_nacimiento', 'curp', 'rfc', 'edad', 'telefono',"ocupacion", 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosAlumno>(this.lista_alumnos as DatosAlumno []);

   @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }


  constructor(
    public facadeService: FacadeService,
    public maestrosService: AlumnosService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    //Obtener maestros
    this.obtenerAlumnos();
  }
  // Consumimos el servicio para obtener los alumnos
    //Obtener alumnos
    public obtenerAlumnos() {
      this.maestrosService.obtenerListaAlumnos().subscribe(
        (response) => {
          this.lista_alumnos = response;
          console.log("Lista users: ", this.lista_alumnos);
          if (this.lista_alumnos.length > 0) {
            //Agregar datos del nombre e email
            this.lista_alumnos.forEach(usuario => {
              usuario.first_name = usuario.user.first_name;
              usuario.last_name = usuario.user.last_name;
              usuario.email = usuario.user.email;
            });
            console.log("Maestros: ", this.lista_alumnos);

            this.dataSource = new MatTableDataSource<DatosAlumno>(this.lista_alumnos as DatosAlumno[]);
          }
        }, (error) => {
          console.error("Error al obtener la lista de maestros: ", error);
          alert("No se pudo obtener la lista de maestros");
        }
      );
    }

  public goEditar(idUser: number) {
    this.router.navigate(["registro-usuarios/alumnos/" + idUser]);
  }

  public delete(idUser: number) {

  }
}

export interface DatosAlumno {
  id_alumno: number;
  nombre: string;
  email: string;
  matricula: string;
  fecha_nacimiento: Date;
  telefono: string;
  rfc: string;
  curp: string;
  edad: number;
  ocupacion: string;

}
