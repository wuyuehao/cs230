import pandas as pd
import click
import numpy as np
from collections import OrderedDict
from sklearn.utils import shuffle


@click.command()
@click.argument('train_file', type=click.Path(exists=True))
@click.argument('train_label', type=click.Path(exists=True))
@click.argument('test_file',  type=click.Path(exists=True))
@click.argument('test_label', type=click.Path(exists=True))


def run(train_file, train_label, test_file, test_label):
    train, test =  getDataSplitted(train_file, train_label, test_file, test_label)
    print(train)
    print(test)


def getDataSplitted(train_file, train_label, test_file, test_label):
    train = pd.read_csv(train_file, header = None, names=['text'])
    label = pd.read_csv(train_label, header = None, names=['label'])
    train, label = shuffle(train, label)
    train['label'] = label

    test = pd.read_csv(test_file, header = None, names=['text'])
    test['label'] = pd.read_csv(test_label, header = None, names=['label'])
    test_tag_map = getTagMap(test['label'].unique())
    # added 07/12/19
    train_tag_map = getTagMap(train['label'].unique())
    tag_map = {**train_tag_map, **test_tag_map}

    return(train, test, tag_map)

def getData(data_file, train_test_split):
    df = pd.read_csv(data_file, header=None, names=['text', 'label'])
    tag_map = getTagMap(df['label'].unique())
    msk = np.random.rand(len(df)) < train_test_split
    train = df[msk]
    test = df[~msk]
    return (train, test, tag_map)

def getTagMap(labels):
    tag_map = dict()
    i=0
    for tag in labels :
        tag_map[tag] = i
        i=i+1
    return tag_map

if __name__ == '__main__':
    run()

