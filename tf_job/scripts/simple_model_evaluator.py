import pandas as pd
import click
import collections

@click.command()

def run():
    actual = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
    pred = [1, 1, 1, 0, 0, 1, 0, 0, 0, 0]
    labels =[0, 1]
    accuracy, tp, fp, fn, precision, recall = eval(actual, pred, labels)
    print(accuracy, tp, fp, fn, precision, recall)

def eval(actual, pred, labels):
    accu=0
    tp=collections.defaultdict(lambda : 0)
    fp=collections.defaultdict(lambda : 0)
    fn=collections.defaultdict(lambda : 0)
    precision=collections.defaultdict(lambda : 0)
    recall=collections.defaultdict(lambda : 0)

    confusion_matrix = collections.defaultdict(lambda: collections.defaultdict(lambda:0))
    for i,val in enumerate(actual):
        if val==pred[i]:
            accu = accu + 1
            tp[val]=tp[val]+1
        else:
            fp[pred[i]] = fp[pred[i]]+1
            fn[val] = fn[val] + 1

        confusion_matrix[val][pred[i]] = confusion_matrix[val][pred[i]] + 1

    for tag in labels:
        if (tp[tag] + fp[tag]) != 0:
            precision[tag] = tp[tag]/(tp[tag] + fp[tag])
            recall[tag] = tp[tag] / (tp[tag] + fn[tag])
    return (accu/len(actual), tp, fp, fn, precision, recall, confusion_matrix)


if __name__ == '__main__':
    run()
