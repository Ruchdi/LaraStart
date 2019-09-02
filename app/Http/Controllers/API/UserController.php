<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct()
    {
        //You must learn about laravel passport
        $this->middleware('auth:api');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return User::latest()->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //return ['message'=>'I have your data.'];
        //return $request->all();
        $this->validate($request,[
            'name'  => 'required|string|max:191',
            'email' => 'required|string|email|max:191|unique:users',
            'password'  =>  'required|string|min:6',
            'type'  =>  'required'
        ]);
        return User::create([
            'name'  => $request['name'],
            'email' => $request['email'],
            'password'  => Hash::make($request['password']),
            'type'  => $request['type'],
            'photo' => $request['photo']
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    public function profile()
    {
        //show user info in profile component
        return auth('api')->user();
    }

    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();
        $this->validate($request,[
            'name'  => 'required|string|max:191',
            'email' => 'required|string|email|max:191|unique:users,email,'.$user->id,
            'password'  =>  'sometimes|min:6',
        ]);

        $currentPhoto = $user->photo;
        if($request->photo != $currentPhoto){
            //generate photo name
            //(explode('/', (explode(';', $request->photo))[0]))[1] for get an extension
            $name = time().'.'.(explode('/', (explode(';', $request->photo))[0]))[1];

            //upload photo
            \Image::make($request->photo)->save(public_path('img/profile/').$name);

            //assign new photo name
            $request->merge(['photo' => $name]);

            //find path of the old photo
            $old_photo = public_path('img/profile/').$currentPhoto;
            if(file_exists($old_photo)){
                @unlink($old_photo);
            }
        }

        if(!empty($request->password)){
            $request->merge(['password'=>Hash::make($request['password'])]);
         }

        $user->update($request->all());
        return ['message' => 'success'];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $this->validate($request,[
            'name'  => 'required|string|max:191',
            'email' => 'required|string|email|max:191|unique:users,email,'.$user->id,
            'password'  =>  'sometimes|min:6',
            'type'  =>  'required'
        ]);
        $user->update($request->all());
        return ['message' => 'Updated'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        // delete user
        $user->delete();
        return ['message'=>'User deleted'];
    }
}
