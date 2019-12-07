import zipfile
import os,sys
import shutil
from tensorflow.python.tools import saved_model_cli
from tensorflow.python.tools import saved_model_utils
from tensorflow.core.framework import types_pb2

def process_file(file):
    model_path = os.path.dirname(file);
    zip_ref = zipfile.ZipFile(file, 'r')
    # assume only 1 directory and the directory name is the model name
    model_name = zip_ref.infolist()[0].filename

    zip_ref.extractall(model_path)
    zip_ref.close()

    shutil.rmtree('/casterlyrock/data/__MACOSX')

    # saved_model_dir = model_path + '/' + model_name
    # if not os.path.isdir(saved_model_dir):
    #     os.mkdir(saved_model_dir)
    # tag_set = "serve"
    # sig_def = saved_model_cli.get_signature_def_map(saved_model_dir, tag_set)
    # meta_graph_def = saved_model_utils.get_meta_graph_def(saved_model_dir,
    #                                                     tag_set)
    #
    #
    # model_info={}
    # for signature_def_key in sorted(sig_def.keys()):
    #     inputs_info = []
    #     outputs_info = []
    #     inputs = meta_graph_def.signature_def[signature_def_key].inputs
    #     outputs = meta_graph_def.signature_def[signature_def_key].outputs
    #     for input_key, tensor_info in sorted(inputs.items()):
    #
    #         dtype = {value: key
    #         for (key, value) in types_pb2.DataType.items()}[tensor_info.dtype]
    #         dims = [str(dim.size) for dim in tensor_info.tensor_shape.dim]
    #         name = tensor_info.name
    #
    #         input_info = {"key": input_key, "dtype": dtype, "dims": dims, "name" : name}
    #         inputs_info.append(input_info)
    #     for key, tensor_info in sorted(outputs.items()):
    #         dtype = {value: key
    #         for (key, value) in types_pb2.DataType.items()}[tensor_info.dtype]
    #         dims = [str(dim.size) for dim in tensor_info.tensor_shape.dim]
    #         name = tensor_info.name
    #         output_info = {"key": key, "dtype": dtype, "dims": dims, "name" : name}
    #         outputs_info.append(output_info)
    #     model_info[signature_def_key] = {"inputs": inputs_info, "outputs": outputs_info}
    # print(model_info)
    # return model_info
    return "success"
