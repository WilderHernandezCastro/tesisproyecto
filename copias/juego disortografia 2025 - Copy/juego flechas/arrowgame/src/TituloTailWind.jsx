
import React from 'react'


function TituloTailWind() {
    return (
        <>

            <div class="bg-lime-600 text-white">
                <h1 class="text-3xl font-bold underline">Hola TailWindCss</h1>
                <button class="bg-blue-400 hover:bg-sky-700 p-2.5 rounded-lg w-24 mx-auto 
                block my-8">Save changes</button>
                <button class="bg-gradient-to-r from-cyan-400 to-fuchsia-600 border-blue-500 hover:bg-sky-700 p-2.5 rounded-lg w-24 mx-auto block my-8 "> changes</button>
            </div >

            <div class='text-3x bg-gradient-to-r from-blue-400 to-fuchsia-600 w-auto h-auto ' >
                <span class='bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-600 text-3xl font-bold underline'>
                    Hola TailWindCss

                </span>
            </div>

            <div>
                <h1 class='max-w-auto w-auto mt-28 bg-amber-300 text-blue-800'>Estados</h1>
            </div>

            <div class="flex place-content-between">

                <div class='bg-blue-600 w-40 h-40 rounded-lg place-content-center'>1</div>
                <div class='bg-blue-600 w-40 h-40 rounded-lg place-content-center'>2</div>
                <div class='bg-blue-600 w-40 h-40 rounded-lg place-content-center'>3</div>

            </div>
        </>
    )
}

export default TituloTailWind