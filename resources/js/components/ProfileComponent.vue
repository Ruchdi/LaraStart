<style>
    .widget-user-header {
        background-position: center center;
        background-size: cover;
        height: 300px !important;
    }

</style>
<template>
    <div class="row">
        <div class="col-md-12 mt-3">
            <div class="card card-widget widget-user">
                <!-- Add the bg color to the header using any of the bg-* classes -->
                <div class="widget-user-header text-white" style="background-image:url('./img/cover.png')">
                    <h3 class="widget-user-username">Elizabeth Pierce</h3>
                    <h5 class="widget-user-desc">Web Designer</h5>
                </div>
                <div class="widget-user-image">
                    <img class="img-circle" :src="getProfilePicture()" alt="User Avatar">
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-sm-4 border-right">
                            <div class="description-block">
                                <h5 class="description-header">3,200</h5>
                                <span class="description-text">SALES</span>
                            </div>
                            <!-- /.description-block -->
                        </div>
                        <!-- /.col -->
                        <div class="col-sm-4 border-right">
                            <div class="description-block">
                                <h5 class="description-header">13,000</h5>
                                <span class="description-text">FOLLOWERS</span>
                            </div>
                            <!-- /.description-block -->
                        </div>
                        <!-- /.col -->
                        <div class="col-sm-4">
                            <div class="description-block">
                                <h5 class="description-header">35</h5>
                                <span class="description-text">PRODUCTS</span>
                            </div>
                            <!-- /.description-block -->
                        </div>
                        <!-- /.col -->
                    </div>
                    <!-- /.row -->
                </div>
            </div>
            <div class="card">
                <div class="card-header p-2">
                    <ul class="nav nav-pills">
                        <li class="nav-item"><a class="nav-link" href="#activity" data-toggle="tab">Activity</a></li>
                        <li class="nav-item"><a class="nav-link active" href="#settings" data-toggle="tab">Settings</a>
                        </li>
                    </ul>
                </div><!-- /.card-header -->
                <div class="card-body">
                    <div class="tab-content">
                        <div class="tab-pane" id="activity">
                            <h1>Activities</h1>
                        </div>
                        <!-- /.tab-pane -->
                        <div class="tab-pane active" id="settings">
                            <form class="form-horizontal">
                                <div class="form-group">
                                    <label for="inputName" class="col-sm-2 control-label">Name</label>

                                    <div class="col-sm-10">
                                        <input v-model="form.name"  type="text" class="form-control" id="inputName" placeholder="Name">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="inputEmail" class="col-sm-2 control-label">Email</label>

                                    <div class="col-sm-10">
                                        <input v-model="form.email" type="email" class="form-control" id="inputEmail" placeholder="Email">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="inputExperience" class="col-sm-2 control-label">Experience</label>

                                    <div class="col-sm-10">
                                        <textarea class="form-control" id="inputExperience"
                                            placeholder="Experience"></textarea>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="password" class="col-sm-2 control-label">Password</label>
                                    <div class="col-sm-10">
                                        <input v-model="form.password" type="password" name="password" class="form-control"
                                        :class="{ 'is-invalid': form.errors.has('password') }" placeholder="Password">
                                        <small id="passwordHelp" class="form-text text-muted">Leave empty if not changing.</small>
                                        <has-error :form="form" field="password"></has-error>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputFile" class="col-sm-2 control-label">File input</label>
                                    <div class="col-sm-10">
                                        <div class="input-group">
                                            <div class="custom-file">
                                                <input type="file" @change="updateProfile" class="custom-file-input" name="photo">
                                                <label class="custom-file-label" for="exampleInputFile">Choose file</label>
                                            </div>
                                            <div class="input-group-append">
                                                <span class="input-group-text" id="">Upload</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-sm-offset-2 col-sm-10">
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox"> I agree to the <a href="#">terms and
                                                    conditions</a>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-sm-offset-2 col-sm-10">
                                        <button @click.prevent="updateInfo" :disabled="form.busy" type="submit" class="btn btn-primary">{{btnText}}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <!-- /.tab-pane -->
                    </div>
                    <!-- /.tab-content -->
                </div><!-- /.card-body -->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                btnText : "Update",
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    photo: ''
                }),
            }
        },
        mounted() {
            console.log('Component mounted.')
        },
        methods:{
            getProfilePicture(){
                let photo = this.form.photo;
                if(this.form.photo){
                    let prefix = (this.form.photo.match(/\//) ? '' : '/img/profile/');
                    return prefix + this.form.photo;
                }else {
                    photo = 'img/profiles/' + this.form.photo;
                }
                return photo;
            },
            updateProfile(e){
                //console.log('uploading');
                let file = e.target.files[0];
                //console.log(file);
                let reader = new FileReader();
                reader.onloadend = (file) => {
                    //console.log('RESULT', reader.result);
                    this.form.photo = reader.result;
                };
                reader.readAsDataURL(file);
            },
            updateInfo(){
                this.$Progress.start()
                this.btnText = "Updating";
                this.form.put('api/profile')
                .then(() => {
                    //success
                    swal.fire(
                        'Updated!',
                        'User information has been Updated.',
                        'success'
                    )
                    this.btnText = "Update";
                    this.$Progress.finish()
                })
                .catch(() => {
                    this.btnText = "Update";
                    this.$Progress.fail()
                })
            },
        },
        created() {
            this.$Progress.start()
            axios.get('api/profile')
            .then(({ data }) => {
                this.form.fill(data)
                this.$Progress.finish()
            });
        }
    }

</script>
