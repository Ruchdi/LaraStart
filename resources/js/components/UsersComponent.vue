<template>
    <div class="row mt-5">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Users Table</h3>

                    <div class="card-tools">
                        <button class="btn btn-success" @click="newModal()">
                            <i class="fas fa-user-plus"></i> Add New
                        </button>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                    <table class="table table-hover table-bordered table-striped">
                        <thead class="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Registered At</th>
                                <th>Modify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users" :key="user.id">
                                <td>{{user.id}}</td>
                                <td>{{user.name}}</td>
                                <td>{{user.email}}</td>
                                <td><span class="tag tag-success">{{user.type | upText}}</span></td>
                                <td>{{user.created_at | setDate}}</td>
                                <td>
                                    <a href="#" @click="editModal(user)">
                                        <i class="fa fa-edit text-blue"></i>
                                    </a>
                                    /
                                    <a href="#" @click="deleteUser(user.id,user.name)">
                                        <i class="fa fa-trash text-red"></i>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- /.card-body -->
            </div>
            <!-- /.card -->
        </div>
        <!-- Modal -->
        <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-show="!editmode" class="modal-title" id="myModalLabel">Add New User</h5>
                        <h5 v-show="editmode" class="modal-title" id="myModalLabel">Update User's Information</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="editmode ? updateUser() : createUser()" @keydown="form.onKeydown($event)">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Name</label>
                                <input v-model="form.name" type="text" name="name" class="form-control"
                                    :class="{ 'is-invalid': form.errors.has('name') }" placeholder="Enter Name">
                                <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">
                                <label for="email">Email address</label>
                                <input v-model="form.email" type="email" name="email" class="form-control"
                                    :class="{ 'is-invalid': form.errors.has('email') }" placeholder="Enter email">
                                <small id="emailHelp" class="form-text text-muted">We'll never share your email with
                                    anyone else.</small>
                                <has-error :form="form" field="email"></has-error>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input v-model="form.password" type="password" name="password" class="form-control"
                                    :class="{ 'is-invalid': form.errors.has('password') }" placeholder="Password">
                                <has-error :form="form" field="password"></has-error>
                            </div>
                            <div class="form-group">
                                <label for="type">User Role</label>
                                <select v-model="form.type" class="form-control" name="type"
                                    :class="{ 'is-invalid': form.errors.has('type') }">
                                    <option value="">Select User Role</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <has-error :form="form" field="type"></has-error>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <!-- for add show when edit mode = false -->
                            <button v-show="!editmode" :disabled="form.busy" type="submit" class="btn btn-success">Save</button>
                            <!-- for update show when edit mode = true -->
                            <button v-show="editmode" :disabled="form.busy" type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                users: [],
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    photo: ''
                }),
                //check when user click on edit save go to edit function.
                //editmode ? updateUser() : createUser()
                editmode: false,
            }
        },
        methods: {
            loadUsers() {
                this.$Progress.start()
                axios.get('api/user')
                .then(({data}) => {
                    this.users = data.data
                    this.$Progress.finish()
                });
            },
            newModal() {
                this.editmode = false;
                //reset is a function in vForm
                this.form.reset();
                this.form.clear();
                $('#myModal').modal('show');
            },
            createUser() {
                this.$Progress.start()
                // Submit the form via a POST request
                this.form.post('api/user')
                    .then(() => {
                        this.loadUsers();
                        $('#myModal').modal('hide');
                        toast.fire({
                            type: 'success',
                            title: 'Created successfully'
                        })
                        this.$Progress.finish()
                    })
                    .catch(() => {
                        //display error
                        this.$Progress.fail()
                    })
            },
            editModal(user) {
                this.editmode = true;
                //reset is a function in vForm
                this.form.reset();
                this.form.clear();
                $('#myModal').modal('show');
                //fill user data in a form
                this.form.fill(user);
            },
            updateUser(){
                this.$Progress.start()
                //console.log('Editing Data.');
                this.form.put('api/user/'+this.form.id)
                .then(() => {
                    //success
                    this.loadUsers();
                    $('#myModal').modal('hide');
                    swal.fire(
                        'Updated!',
                        'User information has been deleted.',
                        'success'
                    )
                    this.$Progress.finish()
                })
                .catch(() => {
                    //error
                    this.$Progress.fail()
                })
            },
            deleteUser(id,name) {
                swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert "+name+" !",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    // Send request to the server
                    if (result.value) {
                        this.form.delete('/api/user/'+id)
                        .then(() => {
                            this.loadUsers();
                            swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            )
                        })
                        .catch((error) => {
                            //console.log(error.request.response.message);
                            swal.fire('Failed?', error.message, 'warning')
                        })
                    }
                })
            }
        },
        created() {
            this.loadUsers();
        }
    }

</script>
